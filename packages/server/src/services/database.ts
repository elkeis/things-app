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
