import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from '../../context';

export const {
    router,
    middleware,
    procedure,
    ...extra
} = initTRPC
  .context<Context>()
  .create(); 

const auth = middleware((opts) => {
  const { ctx } = opts;
  if (ctx.session) {
    return opts.next({
      ctx,
    });
  } else {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
    });
  }
});

export const protectedProcedure = procedure.use(auth);
