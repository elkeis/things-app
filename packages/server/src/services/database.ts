import {PrismaClient} from '@prisma/client'
import { service } from './service';
import { BaseThing, Thing } from '@local/schemas';
import { GithubUser } from './github';
import { TRPCError } from '@trpc/server';

const db = new PrismaClient();


export const getAllThingsOnRootLevel = service(ctx => 
  async () => {
    return await db.physicalObject.findMany({
      include: {
        container: true,
      },
      where: {
        container: {
          is: null,
        }
      },
      orderBy: {
        createdAt: {
          sort: 'asc',
        }
      }
    })
  }  
)

export const createThing = service(ctx => 
  async (thing: BaseThing) => {
    const physicalObject =  await db.physicalObject.create({
      data: {
        ...thing,
        contents: {
          connect: []
        }
      }
    })

    ctx.log(physicalObject, 'new thing created');
    return physicalObject;
  }
)

export const deleteThing = service(ctx => 
  async ({id}: {id: string}) => {
    const physicalObject = await db.physicalObject.findUnique({
      where: {
        id,
      },
      include: {
        contents: true,
      }
    })
    if (physicalObject) {
      const operations = [];

      if (physicalObject.contents.length > 0 ) {  
        operations.push(db.physicalObject.updateMany({
          where: {
            id: {
              in: physicalObject.contents.map(item => item.id)
            }
          },
          data: {
            containerId: physicalObject.containerId,
          }
        }));
      }
      operations.push(db.physicalObject.delete({
        where: {
          id,
        }
      }));
      try {
        const result = await db.$transaction(operations);
        return result[result.length - 1];
      } catch (ex) {
        ctx.log(ex, `failed to delete thing: ${id} cause error`, 'error');
        throw new Error(`failed to delete Thing:${id}`);
      }
    } else {
      throw new Error(`Thing: ${id} is not exist anymore`);
    }
  }
)

export const registerLogin = service(ctx => 
  async (user: GithubUser) => {
    try {
      await db.login.create({
        data: {
          githubUser: user.login
        }
      });
    } catch (ex) {
      ctx.log(ex, `can't register login with ${user.login}`, 'error');
    }
  }
)

export const findThingsById = service(ctx => 
  async (id: string | undefined) => {
    try {
      if (!id) {
        let root = await db.physicalObject.findFirst({
          where: {
            type: 'ROOT',
          }
        });
        if (!root) {
          const {id} = await db.physicalObject.create({
            data: {
              type: 'ROOT',
              name: 'Free Space',
              description: 'Root container',
              volume: 0xCAFE,
            }
          })
          root = await db.physicalObject.update({
            where: {
              id,
            }, 
            data: {
              containerId: id
            }
          })
        }

        const contents = await getAllThingsOnRootLevel() || [];
        const result = {
          ...root,
          contents,
          id: undefined,
        };

        ctx.log(result)
        return result;
      } else {
        const result = await db.physicalObject.findUnique({
          where: {
            id
          },
          include: {
            contents: true,
          }
        });
        ctx.log(result)
        return result;
      }
    } catch (ex) {
      ctx.log(ex, `can't fetch Thing:${id}`, 'error');
      return null;
    }
  }
)

export const packContainer = service(ctx => 
  async (containerId: string, items: string[]) => {
    try {

      const container = await db.physicalObject.findUnique({
        where: {
          id: containerId
        },
        include: {
          contents: true,
        }
      });
  
      const thingsToRemove = container?.contents.filter(thing => !items.includes(thing.id)).map(thing => thing.id);
  
      const operations = [];
      operations.push(db.physicalObject.updateMany({
        where: {
          id : {
            in: items
          }
        },
        data: {
          containerId,
        }
      }));
      if (thingsToRemove && thingsToRemove.length) {
        operations.push(db.physicalObject.updateMany({
          where: {
            id: {
              in: thingsToRemove,
            }
          }, 
          data: {
            containerId: container?.containerId
          },
        }))
      }
  
      await db.$transaction(operations);

      return await findThingsById(containerId);
    }  catch (ex) {
      ctx.log(ex, `error ocurred with packing Container:${containerId}`, 'error');
      throw new TRPCError({
        message: `Unable to pack container ${containerId}, please reload page, or try again later`,
        code: 'INTERNAL_SERVER_ERROR',
        cause: ex
      })
    }
  }  
)
