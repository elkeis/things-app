import { Context } from '../context';
import * as services from '../services';
import {merge, cloneDeep} from 'lodash';

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export const mockServices = (mockObj: DeepPartial<typeof import('../services')> = {}): Context => {
  return merge({...cloneDeep(services)}, mockObj)
}
