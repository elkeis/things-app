import {beforeEach, describe, expect, it} from 'vitest';
import { github } from './github';
import { mockServices } from '../test/mockServices';


describe('github router', () => {
  let caller: ReturnType<typeof github.createCaller>;
  beforeEach(() => {

    const ctx = mockServices({
      github: {
        getAuthUrl: async () => 'test-url'
      }
    });

    console.log(ctx.github.getAuthUrl.toString());
    caller = github.createCaller(ctx);
  })

  it('should return expected value', async () => {
    expect(await caller.getAuthUrl()).toEqual('test-url');
  })
})
