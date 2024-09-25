import { getAllThingsOnRootLevel } from "@local/server/src/services/database";
import { TrpcService } from "../services/trpc.service";
import { AbstractWordsGame } from "./abstract-words-game";


export class WordsGameOnline extends AbstractWordsGame {
  static ASTERISK_REGEX = new RegExp(/\*/g);

  private solvedWordsMap: Map<string, number> = new Map<string, number>();

  public static create(trpc: TrpcService) {
    return new WordsGameOnline(trpc);
  }

  private constructor(private readonly trpc: TrpcService) {
    super();
  }

  public override async loadLevel(index: number): Promise<void> {
    const level = await this.trpc.client.game.loadLevel.query(index);
    this.words = level.words.map(word => word.replaceAll(WordsGameOnline.ASTERISK_REGEX, ' '));
    this.levenNo = index;
    this.solvedWordsMap.clear();
  }

  public override getWords(): string[] {
    const words: string[] = [...this.words];
    this.solved.forEach((word) => {
      if (this.solvedWordsMap.has(word)) {
        words[this.solvedWordsMap.get(word)!] = word;
      }
    });
    return words;
  }

  public override isLevelComplete(): boolean {
    return this.words.length === this.solved.length;
  }

  public override async guessWord(word: string): Promise<number> {
    if (word.length <= 0 || this.solved.includes(word)) return -1;

    const {
      found,
      wordIndex,
    } = await this.trpc.client.game.guessWord.query({
      level: this.levenNo,
      word,
    });

    if (found && wordIndex !== undefined) {
      this.solved.push(word);
      this.solvedWordsMap.set(word, wordIndex);
      return wordIndex;
    } else {
      return -1;
    }
  }

  public override getLetters(): Promise<string[]> {
    return this.trpc.client.game.getLetters.query({
      level: this.levenNo
    });
  }
}
