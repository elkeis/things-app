import { z } from "zod";
import { procedure, router } from "./trpc";

export const game = router({
  loadLevel: procedure
    .input(z.number().min(1).max(Infinity))
    .output(z.object({
      words: z.array(z.string())
    }))
    .query(async ({ctx, input}) => {
      return await ctx.game.loadUserLevel(input)
    }),

  guessWord: procedure
    .input(z.object({
      level: z.number().min(1).max(Infinity),
      word: z.string().nonempty()
    }))
    .output(z.object({
      found: z.boolean(),
      wordIndex: z.number().min(0).optional()
    }))
    .query(async ({ctx, input}) => {
      return await ctx.game.guessWord(input.level, input.word);
    }),

  getLetters: procedure
    .input(z.object({
      level: z.number().min(1).max(Infinity)
    }))
    .output(z.array(z.string().min(1).max(1).nonempty()))
    .query(async ({ctx, input}) => {
      return await ctx.game.getLetters(input.level);
    })
});
