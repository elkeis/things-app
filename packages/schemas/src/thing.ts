import {z} from 'zod';

export const thingSchemaBase = z.object({
  id: z.string().uuid().optional(),
  emoji: z.string().emoji('must be emoji 😊').optional().nullable(),
  description: z.string().max(128, 'length must be <= 128 symbols').nullable(),
  name: z.string().min(1, 'must have a value').max(25, `must be <= 25 symbols`),
  volume: z.number().min(1, 'must be >= 1').max(0xCAFE + 1, "It's over 9000!"),
  containerId: z.string().uuid().optional().nullable(),
  type: z.enum(['THING', 'CONTAINER', 'ROOT'], {required_error: 'must have a value'}),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type BaseThing = z.infer<typeof thingSchemaBase>

export type Thing = BaseThing & {
  contents: BaseThing[],
}

export const thingSchema: z.ZodType<Thing> = thingSchemaBase.extend({
  contents: z.lazy(() => thingSchemaBase.array())
}) 

export const rootSchema: z.ZodType<Omit<Thing, 'id'> & {id: null}> = thingSchemaBase.extend({
  id: z.null(),
  contents: z.lazy(() => thingSchemaBase.array())
})
