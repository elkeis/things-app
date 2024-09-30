import { join } from "path";
import { service } from "./service";
import { readdir, readFile } from "fs/promises";
import { z } from "zod";

const FILES_DIR = join(__dirname, './data');

const levelSchema = z.object({
  words: z.array(z.string())
})

type Level = z.infer<typeof levelSchema>;

export const loadLevel = service(ctx => 
  async (index: number): Promise<Level> => {
    const files = await readdir(FILES_DIR);
    const lvlFile = files[(index - 1)  % files.length];
    try {
      const fileData = JSON.parse(
        await readFile(
          join(FILES_DIR, lvlFile), 
          {encoding: 'utf-8'}
        )
      );
  
      const level = levelSchema.parse(fileData);

      return level;
    } catch (error) {
      ctx.log(error, 'error during parsing level file', 'error');
      throw error;
    }
  }
)

/**
 * Load level from level-file with hidden - **** words
 */
export const loadUserLevel = service(ctx => 
  async (index: number): Promise<Level> => {
    try {
      return {
        words: (await ctx.game.loadLevel(index))
          .words
          .map(word => word
            .split('')
            .map(() => '*')
            .join('')
          )
      }
    } catch (error) {
      ctx.log(error, 'error during lvl loading', 'error');
      throw error;
    }
  }
)

export const guessWord = service(ctx => 
  async (
    levelNumber: number, 
    word: string
  ): Promise<{found: boolean, wordIndex?: number}> => {
    try {
      const level = await ctx.game.loadLevel(levelNumber);
      const wordIndex = level.words.indexOf(word);
      const found = wordIndex >= 0;

      if (found) {
        return {
          found,
          wordIndex
        }
      } else {
        return {
          found
        }
      }
    } catch (error) {
      ctx.log(error, 'error during lvl loading', 'error');
      throw error;
    }
  }
)

export const getLetters = service(ctx =>
  async (levelNumber: number): Promise<string[]> => {
    try {
      const words  = (await ctx.game.loadLevel(levelNumber)).words;
      const alphabet = words.reduce((alphabet: any, word) => {
        const localAlphabet = {} as any;
        word.split('').forEach(letter =>{
          localAlphabet[letter] = localAlphabet[letter] || [];
          localAlphabet[letter].push(letter);
        });
  
        return Object.keys({
          ...alphabet,
          ...localAlphabet,
        }).reduce((result, key) => {
          const currentLetters = alphabet[key] || [];
          const newLetters = localAlphabet[key] || [];
          const lettersToApply = currentLetters.length > newLetters.length ? currentLetters : newLetters;
  
          return {
            ...result,
            [key]: lettersToApply,
          };
        }, {});
      }, {})
  
      return Object.values(alphabet).flat() as string[];
    } catch (ex) {
      ctx.log(ex, 'error during building alphabet', 'error');
      throw ex;
    }
  }
)
