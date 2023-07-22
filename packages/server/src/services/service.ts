import * as services from './index';

type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export const service = <S extends (ctx: typeof services) => (...args: any[]) => any>(
  definition: S
):<R = Awaited<ReturnType<ReturnType<S>>>>(...args: ArgsType<ReturnType<S>>) => Promise<R> => {
  return (...args) => definition(services)(...args)
}
