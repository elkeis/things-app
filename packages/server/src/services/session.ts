import { TRPCError } from "@trpc/server";
import { service } from "./service";
import { IncomingMessage } from "http";

export const login = service(ctx => 
  async ({githubCode}: {githubCode: string}) => {
    try {
      const githubAccessToken = await ctx.github.getAccessToken({code: githubCode});
      const user = await ctx.github.getUser(githubAccessToken.access_token);
      return await ctx.jwt.encrypt(user);
    } catch (error) {
      ctx.log(undefined, `error during login: ${error}`, 'error');
      throw new TRPCError({
        message: 'login error',
        code: 'FORBIDDEN',
      })
    }
  }
)

export const verify = service(ctx => 
  async (req: IncomingMessage, requestContext: typeof import('./index')) => {
    try {
      const jwt = req.headers.authorization?.split(' ')[1];
      if (!jwt) throw new Error('no jwt');
      const session = await ctx.jwt.safeDecrypt(jwt);
      return {
        ...requestContext,
        session,
      }
    } catch (ex) {
      ctx.log(null, `not authorized request to: ${req.url}, cause ${ex}`, 'info');
      return {
        ...requestContext,
        session: undefined,
      }
    }
  }
)
