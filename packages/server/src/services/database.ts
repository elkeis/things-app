import {PrismaClient} from '@prisma/client'
import { service } from './service';
import { BaseThing, Thing } from '@local/schemas';

const db = new PrismaClient();


export const getAllThingsOnRootLevel = service(ctx => 
  async () => {
    return await db.physicalObject.findMany({
      include: {
        container: true,
        contents: true,
      },
      where: {
        container: {
          is: undefined,
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
            containerId: null
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
