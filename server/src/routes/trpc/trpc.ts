import { initTRPC } from '@trpc/server';
import { Context } from '../../context';
 
export const {
    router,
    middleware,
    procedure,
    ...extra
} = initTRPC
  .context<Context>()
  .create(); 
