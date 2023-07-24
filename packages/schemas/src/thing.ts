import {z} from 'zod';

export const thingSchemaBase = z.object({
  id: z.string().uuid().optional(),
  emoji: z.string().emoji('must be emoji 😊').optional().nullable(),
  description: z.string().nullable(),
  name: z.string().min(1, 'must have a value'),
  volume: z.number().min(1, 'must be >= 1').max(100, 'must be <= 100'),
  containerId: z.string().uuid().optional().nullable(),
  type: z.enum(['THING', 'CONTAINER'], {required_error: 'must have a value'}),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type BaseThing = z.infer<typeof thingSchemaBase>

export type Thing = BaseThing & {
  contents: Thing[],
}

export const thingSchema: z.ZodType<Thing> = thingSchemaBase.extend({
  contents: z.lazy(() => thingSchema.array())
}) 
