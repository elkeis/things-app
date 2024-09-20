import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ComponentsModule } from "../../components/components.module";
import { WordsGame } from '../../model/words-game';
import { WordsGameViewComponent } from '../../components/words-game-view/words-game-view.component';

@Component({
  selector: 'app-level',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './level.component.html',
  styleUrl: './level.component.scss'
})
export class LevelComponent implements OnInit, OnChanges {

  @ViewChild(WordsGameViewComponent) gameView!: WordsGameViewComponent;
  @ViewChild('glass') glass!: ElementRef<HTMLDivElement>;

  @Output('onLevelComplete') onLevelComplete = new EventEmitter<void>();

  @Input('level') level = 1;

  game = WordsGame.create();
  words: string[] = []
  currentSelection: string = '';
  letters: string[] = [];
  public guessing = false;


  async ngOnInit(): Promise<void> {
    await this.setupGame();
  }

  async ngOnChanges(_changes: SimpleChanges): Promise<void> {
    await this.setupGame();
  }

  private async setupGame() {
    await this.game.loadLevel(this.level);
    this.words = this.game.getWords();
    this.letters = this.game.getLetters();
    this.guessing = false;
    this.currentSelection = '';
  }

  processSelectLetter(selection: string) {
    if (!this.guessing) {
      this.currentSelection = selection;
    }
  }

  async processGuess(guess: string) {
    if (this.game.isSolved(guess)) return;

    const wordIndex = this.game.guessWord(guess);
    if (wordIndex === -1) {
      this.guessing = false;
      return;
    }
    this.guessing = true;
    this.glass.nativeElement.classList.add('cover');
    try {
      await this.gameView.animateSelection(wordIndex);
      this.words = this.game.getWords();
      this.currentSelection = '';

      if (this.game.isLevelComplete()) {
        this.onLevelComplete.emit();
      }
    } finally {
      this.guessing = false;
      this.glass.nativeElement.classList.remove('cover');
    }
  }
}
