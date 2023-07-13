import { router } from "./trpc";
import { github } from "./github";
import {example} from './example';

export const root = router({
    github,
    example
});

export type AppRouter = typeof root;
