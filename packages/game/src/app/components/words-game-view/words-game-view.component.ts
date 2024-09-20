import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { SplitPipe } from './split.pipe';

@Component({
  selector: 'app-words-game-view',
  standalone: true,
  imports: [SplitPipe],
  templateUrl: './words-game-view.component.html',
  styleUrl: './words-game-view.component.scss'
})
export class WordsGameViewComponent implements OnChanges, OnInit {


  @Input('words') words: string[] = [];
  @Input('selectedWord') selectedWord: string = '';

  @ViewChildren('word') wordElements!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('current_selection') selection!: ElementRef<HTMLDivElement>;
  @ViewChild('root') root!: ElementRef<HTMLDivElement>;

  animations: Animation[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    if(this.words.length) {
      this.root.nativeElement.style.fontSize = `${Math.min(1, 5/this.words.length)}em`;
    }
  }
  ngOnInit(): void {
    if(this.words.length) {
      this.root.nativeElement.style.fontSize = `${Math.min(1, 5/this.words.length)}em`;
    }
  }


  async animateSelection(wordIndex: number) {
    this.selection.nativeElement.style.transition = 'none';
    this.selection.nativeElement.style.fontSize = '1.7em';
    const {x, y} = this.selection.nativeElement.getBoundingClientRect();
    const {x: toX, y: toY} = this.wordElements.get(wordIndex)!.nativeElement.getBoundingClientRect();
    this.selection.nativeElement.style.fontSize = '1em';
    requestAnimationFrame(() => {
      this.animations.push(
        this.selection.nativeElement.animate(
          [
            {

              fontSize: '1em',
              transform: 'translate3d(0px, 0px, 0)',
              color: 'var(--light-letter)',
              '--tile-color': 'var(--winner-word-color)',
            },
            {
              fontSize: '1.7em',
              transform: `translate3d(${toX-x}px, ${toY-y}px, 0)`,
              color: 'var(--light-letter)',
              '--tile-color': 'var(--winner-word-color)',
            }
          ],
          {
            duration: 1000,
            fill: 'forwards'
          }
        ),
        this.selection.nativeElement.animate(
          [
            {
              '--tile-color': 'var(--celebration-word-color)',
              offset: 0,
            },
            {
              '--tile-color': 'var(--celebration-word-color)',
              offset: .49,
            },
            {
              '--tile-color': 'var(--winner-word-color)',
              offset: .5,
            },
            {
              '--tile-color': 'var(--winner-word-color)',
              offset: .99,
            },
          ],
          {
            duration: 300,
            iterations: 9000,
            delay: 1000,
          }
        )
      )
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.resetAnimation();
  }

  resetAnimation(animations: Animation[] = this.animations) {
    animations.splice(0).forEach(animation => animation.cancel());
    // this.selection.nativeElement.style.transition = 'unset';
    // this.selection.nativeElement.style.fontSize = '1em';
    // this.selection.nativeElement.style.transform = 'unset';
    // this.selection.nativeElement.classList.remove('green');
    // this.selection.nativeElement.classList.remove('gold');
  }
}
