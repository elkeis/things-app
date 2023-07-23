import { Injectable, inject } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@local/server/src/routes/trpc/root'
import { SessionService } from './services/session.service';


@Injectable({
  providedIn: 'root'
})
export class TrpcService {

  public readonly client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/trpc',
        headers: async () => {
          const access_token = this.session.getAuth();
          return access_token ? {
            Authorization: `Bearer ${access_token}`
          } : {};
        }
      }),
    ]
  });

  constructor(private session: SessionService) { }
}
