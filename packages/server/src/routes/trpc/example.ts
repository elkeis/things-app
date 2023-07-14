import { router, procedure } from "./trpc";
import {z} from 'zod';

export const example = router({
  hello: procedure
  .input(z.undefined())
  .output(z.string())
  .query(() => {
    return 'hello world';
  })
});

