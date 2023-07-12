import { router } from "./trpc";
import { github } from "./github";

export const root = router({
    github,
});
