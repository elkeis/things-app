import { Injectable } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@local/server/src/routes/trpc/root'


@Injectable({
  providedIn: 'root'
})
export class TrpcService {
  private access_token = ''

  public readonly client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/trpc',
        headers: async () => {
          return this.access_token ? {
            Authorization: `Bearer ${this.access_token}`
          } : {};
        }
      }),
    ]
  });


  setAuth(access_token: string) {
    this.access_token = access_token;
  }

  constructor() { }
}
