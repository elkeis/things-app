const LEVELS = [
  {
    words: [
      "брат","араб","тара",
    ]
  },
  {
    words: [
      "минор","корм","кино","мир",
    ]
  },
  {
    words: [
      "канон","икона","цинк",
    ]
  }
]

/**
 * Off line example of the words game.
 */
export abstract class AbstractWordsGame extends EventTarget {
  protected words: string[] = [];
  public levenNo: number = 0;

  protected solved: string[] = [];

  /**
   *
   * @param index - natural number
   */
  public async loadLevel(index: number) {
    if (index <= 0 ) {
      throw new Error(`level number can't be negative or 0, index = ${index}`);
    }

    this.words = LEVELS[(index - 1)  % LEVELS.length].words;
    this.solved = [];
    this.levenNo = index;

    return await new Promise<void>(resolve => queueMicrotask(() => {
      this.dispatchEvent(new Event('update:level'));
      resolve();
    }));
  }

  public getWords(): string[] {
    return this.words.map(word => {
      if (this.solved.includes(word)) {
        return word;
      } else {
        return word
          .split('')
          .map(() => ' ')
          .join('');
      }
    });
  }

  public isSolved(word: string): boolean {
    return this.solved.includes(word);
  }

  public async guessWord(word: string): Promise<number> {
    if (this.isSolved(word)) {
      this.words.indexOf(word);
    }

    if (this.words.includes(word)) {
      this.solved.push(word);
      return this.words.indexOf(word);
    } else {
      return -1;
    }
  }

  public isLevelComplete(): boolean {
    return this.solved.length === this.words.length;
  }

  public async getLetters(): Promise<string[]> {
    const alphabet = this.words.reduce((alphabet: any, word) => {
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
  }

  public store() {

  }
}
