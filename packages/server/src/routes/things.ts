import { PhysicalObject, PhysicalObjectType } from "@prisma/client";
import { procedure, protectedProcedure, router } from "./trpc";
import {z} from 'zod';
import {thingSchema, thingSchemaBase} from '@local/schemas';

// const thingSchemaBase = z.object({
//   id: z.string().optional(),
//   emoji: z.string().nullable(),
//   description: z.string().nullable(),
//   name: z.string(),
//   volume: z.number(),
//   containerId: z.string().uuid(),
//   type: z.enum(['THING', 'CONTAINER']),
// });

// export type Thing = z.infer<typeof thingSchemaBase> & {
//   contents: Thing[],
// }

// export const thingSchema: z.ZodType<Thing> = thingSchemaBase.extend({
//   contents: z.lazy(() => thingSchema.array())
// })


export const things = router({
  getAllRoots: protectedProcedure
    .input(z.undefined())
    .output(z.array(thingSchemaBase))
    .query(async ({ctx}) => {
      return await ctx.database.getAllThingsOnRootLevel();
    }),
  
  createItem: protectedProcedure
    .input(thingSchemaBase)
    .output(thingSchemaBase)
    .query(async ({ctx, input}) => {
      return await ctx.database.createThing(input)
    }),

  deleteItem: protectedProcedure
    .input(z.object({
      id: z.string().uuid()
    }))
    .output(z.void())
    .query(async ({ctx, input}) => {
      await ctx.database.deleteThing(input);
    }),
  
  getItemById: protectedProcedure
    .input(z.string().uuid())
    .output(thingSchema.or(z.null()))
    .query(async ({ctx, input}) => {
      return await ctx.database.findThingsById(input)
    }),
  packContainer: protectedProcedure
    .input(z.object({
      containerId: z.string().uuid(),
      things: z.array(z.string().uuid()),
    }))
    .output(thingSchema)
    .query(async ({ctx, input}) => {
      return await ctx.database.packContainer(input.containerId, input.things);
    }),
});

