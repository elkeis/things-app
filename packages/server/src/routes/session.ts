import { procedure, router } from "./trpc";
import {z} from 'zod';

export const session = router({
  login: procedure
    .input(z.object({
      githubCode: z.string(),
      redirect_url: z.string().optional(),
    }))
    .output(z.object({access_token: z.string()}))
    .query(async ({ctx, input}) => {
      return {access_token: await ctx.session.login(input)};
    })
});

