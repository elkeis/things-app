import { Injectable } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@local/server/src/routes/trpc/root'


@Injectable({
  providedIn: 'root'
})
export class TrpcService {
  public readonly client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/trpc',
        headers: async () => {
          return {}
        }
      }),
    ]
  });
  constructor() { }
}
