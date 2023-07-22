import { router } from "./trpc";
import { github } from "./github";
import {example} from './example';
import {session} from './session';

export const root = router({
    github,
    example,
    session
});

export type AppRouter = typeof root;
