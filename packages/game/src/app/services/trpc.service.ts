import { Injectable } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@local/server/src/routes'

@Injectable()
export class TrpcService {

  public readonly client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/trpc',
        headers: async () => {
          const access_token = 'this.session.getAuth();';
          return access_token ? {
            Authorization: `Bearer ${access_token}`
          } : {};
        }
      }),
    ]
  });
}
