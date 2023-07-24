import { router, procedure, protectedProcedure } from "./trpc";
import {z} from 'zod';

export const example = router({
  hello: protectedProcedure
  .input(z.undefined())
  .output(z.string())
  .query(() => {
    return 'hello world';
  })
});

