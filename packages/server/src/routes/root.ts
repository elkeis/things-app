import { router } from "./trpc";
// import { github } from "./github";
// import {example} from './example';
import {session} from './session';
// import {things} from './things';
import { game } from "./game";

export const root = router({
    // github,
    // example,
    // session,
    // things,
    game
});

export type AppRouter = typeof root;
