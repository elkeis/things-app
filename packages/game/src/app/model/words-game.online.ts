import { getAllThingsOnRootLevel } from "@local/server/src/services/database";
import { TrpcService } from "../services/trpc.service";
import { AbstractWordsGame } from "./abstract-words-game";
import { Storable } from "./storable";


export class WordsGameOnline extends AbstractWordsGame {
  static ASTERISK_REGEX = new RegExp(/\*/g);
  private solvedWordsMap: Map<string, number>;

  public static create(trpc: TrpcService) {
    return new WordsGameOnline(trpc);
  }

  private constructor(private readonly trpc: TrpcService) {
    super('Game:Online');
    this.solvedWordsMap = new Map<string, number>();
  }

  @Storable.persistStateAfterExecution()
  public override async loadLevel(index: number): Promise<void> {
    if (index <= this.levenNo) return;

    const level = await this.trpc.client.game.loadLevel.query(index);
    this.words = level.words.map(word => word.replaceAll(WordsGameOnline.ASTERISK_REGEX, ' '));
    this.levenNo = index;
    this.solvedWordsMap.clear();

    this.solved.splice(0);
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

  @Storable.persistStateAfterExecution()
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

  public override toString(): string {
    const {
      solved,
      words,
      levenNo,
      solvedWordsMap,
      updatedAt,
      storageKey,
    } = this;

    return JSON.stringify({
      solved,
      words,
      levenNo,
      updatedAt,
      storageKey,
      solvedWordsMap: Object
        .entries(Object.fromEntries(solvedWordsMap))
        .reduce(
          (result, [k, v]) => ({...result, [k]: v}),
          {}
        )
    });
  };


  public override updateFromStorage() {
    const {
      solvedWordsMap,
      ...rest
    } = this.fromString(localStorage.getItem(this.storageKey) || '') as {solvedWordsMap: Record<string, number>};
    Object.assign(this, rest);
    this.solvedWordsMap.clear();
    Object.entries(solvedWordsMap as Record<string, number> || {}).forEach(([k,v]) => {
      this.solvedWordsMap.set(k, v);
    });

    this.dispatchUpdate();
    return this;
  }
}
