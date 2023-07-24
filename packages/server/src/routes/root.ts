import { router } from "./trpc";
import { github } from "./github";
import {example} from './example';
import {session} from './session';
import {things} from './things';

export const root = router({
    github,
    example,
    session,
    things,
});

export type AppRouter = typeof root;
