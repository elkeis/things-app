import { inferAsyncReturnType } from "@trpc/server"

import * as services from './services';
import { IncomingMessage, OutgoingMessage } from "http";

type CreateContextOpts = {req: IncomingMessage, res: OutgoingMessage}; // TODO: use @trpc types, after fixing node compilation errors;

export const createContext = async ({req}: CreateContextOpts) => {
  return await services.session.verify(req, {
    ...services
  });
}

export type Context = inferAsyncReturnType<typeof createContext>;
