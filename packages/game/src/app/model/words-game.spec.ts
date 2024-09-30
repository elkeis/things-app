import { WordsGame } from './words-game';

describe('WordsGame', () => {
  it('should build correct letters', async () => {
    const game = new WordsGame();
    await game.loadLevel(1);

    expect(await game.getLetters()).toEqual('браат'.split(''));
  })
});
