import { AbstractWordsGame } from "./abstract-words-game";

export class WordsGame extends AbstractWordsGame {
  static create() {
    return new WordsGame();
  }

  public constructor() {
    super('Game:Offline')
  }
}
