import { accessTokenSchema } from "../../services/github";
import { procedure, router } from "./trpc";
import {z} from 'zod';

export const github = router({
  getAuthUrl: procedure
    .input(z.undefined())
    .output(z.string())
    .query(({ctx}) => {
      return ctx.github.getAuthUrl();
    }),
  getAccessToken: procedure
    .input(z.object({code: z.string(), redirect_uri: z.string()}))
    .output(accessTokenSchema)
    .query(({ctx, input}) => {
      return ctx.github.getAccessToken(input);
    })
});

