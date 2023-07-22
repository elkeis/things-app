import { TRPCError } from "@trpc/server";
import { service } from "./service";
import { IncomingMessage } from "http";

export const login = service(ctx => 
  async ({githubCode, redirect_url}: {githubCode: string, redirect_url?: string}) => {
    try {
      const githubAccessToken = await ctx.github.getAccessToken({code: githubCode, redirect_uri: redirect_url});
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
      const sessionData = await ctx.jwt.safeDecrypt(jwt);
      return {
        ...requestContext,
        sessionData,
      }
    } catch (ex) {
      return {
        ...requestContext,
        sessionData: undefined,
      }
    }
  }
)
