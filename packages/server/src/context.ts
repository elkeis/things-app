import { inferAsyncReturnType } from "@trpc/server"
import * as services from './services';

export const createContext = () => {
  return services;
}

export type Context = inferAsyncReturnType<typeof createContext>;
