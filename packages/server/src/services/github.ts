import { TRPCError } from "@trpc/server";
import { service } from "./service"
import {z} from 'zod';

export const accessTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  refresh_token_expires_in: z.number(),
  token_type: z.string().regex(/bearer/g),
});

export type AccessToken = z.infer<typeof accessTokenSchema>;

const {
  client_id,
  client_secret
} = process.env;

export const getAuthUrl = service(() => 
  async () => {
    return `https://github.com/login/oauth/authorize?client_id=${client_id}`
  }
)

export const getAccessToken = service((ctx) => 
  async ({
    code,
    redirect_uri,
  }: {
    code: string,
    redirect_uri?: string,
  }) => {
    try {
      return await ctx.network.request<AccessToken>(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          json: {
            code,
            redirect_uri,
            client_id,
            client_secret,
          },
          headers: {
            'Content-Type': 'application/json'
          },
          schema: accessTokenSchema,
        }
      )
    } catch (ex) {
      ctx.log(ex, 'error');
      throw new TRPCError({
        message: 'github service error',
        code: 'INTERNAL_SERVER_ERROR',
      })
    }
  }
)

