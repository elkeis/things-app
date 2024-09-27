import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ComponentsModule } from "../../components/components.module";
import { WordsGame } from '../../model/words-game';
import { WordsGameViewComponent } from '../../components/words-game-view/words-game-view.component';
import { TrpcService } from '../../services/trpc.service';
import { ServicesModule } from '../../services/services.module';
import { AbstractWordsGame } from '../../model/abstract-words-game';
import { WordsGameOnline } from '../../model/words-game.online';

@Component({
  selector: 'app-level',
  standalone: true,
  imports: [ComponentsModule, ServicesModule],
  templateUrl: './level.component.html',
  styleUrl: './level.component.scss'
})
export class LevelComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(WordsGameViewComponent) gameView!: WordsGameViewComponent;
  @ViewChild('glass') glass!: ElementRef<HTMLDivElement>;

  @Output('onLevelComplete') onLevelComplete = new EventEmitter<void>();
  @Output('onCurrentGameIsStale') onCurrentGameIsStale = new EventEmitter<void>();

  @Input('level') level = 1;

  game: AbstractWordsGame;

  constructor(private readonly trpc: TrpcService) {
    this.game = WordsGameOnline.create(trpc).updateFromStorage();
  }

  words: string[] = []
  currentSelection: string = '';
  letters: string[] = [];
  public guessing = false;

  private offFns: CallableFunction[] = [];


  async ngOnInit(): Promise<void> {
    await this.setupGame();
    const handler = () => {
      this.onCurrentGameIsStale.emit();
    }
    this.game.addEventListener('update', handler);
    this.offFns.push(() => {
      this.game.removeEventListener('update', handler);
    })
  }

  async ngOnDestroy() {
    this.offFns.splice(0).forEach(fn => fn());
  }

  async ngOnChanges(_changes: SimpleChanges): Promise<void> {
    await this.setupGame();
  }

  private async setupGame() {
    await this.game.loadLevel(this.level);
    this.updateValues();
  }

  private async updateValues() {
    this.words = this.game.getWords();
    this.letters = await this.game.getLetters();
    this.guessing = false;
    this.level = this.game.levenNo;
    this.currentSelection = '';
    this.tryToCompleteLevel();
  }

  private tryToCompleteLevel() {
    if (this.game.isLevelComplete()) {
      this.onLevelComplete.emit();
    }
  }

  processSelectLetter(selection: string) {
    if (!this.guessing) {
      this.currentSelection = selection;
    }
  }

  async processGuess(guess: string) {
    if (this.game.isSolved(guess)) return;
    this.guessing = true;
    const wordIndex = await this.game.guessWord(guess);
    if (wordIndex === -1) {
      this.guessing = false;
      this.processSelectLetter('');
      return;
    }
    this.glass.nativeElement.classList.add('cover');
    try {
      await this.gameView.animateSelection(wordIndex);
      this.words = await this.game.getWords();
      this.currentSelection = '';
      this.tryToCompleteLevel();

    } finally {
      this.guessing = false;
      this.glass.nativeElement.classList.remove('cover');
    }
  }
}
