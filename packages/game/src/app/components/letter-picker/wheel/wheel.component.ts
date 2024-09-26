import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-wheel',
  standalone: true,
  imports: [],
  templateUrl: './wheel.component.html',
  styleUrl: './wheel.component.scss'
})
export class WheelComponent implements AfterViewInit, OnChanges, OnDestroy {
  static readonly EVENTS = [
    'touchstart',
    'touchmove',
    'touchend',
    'mousedown',
    'mouseenter',
  ] as Array<keyof HTMLElementEventMap>;

  /**
   * Optional tracking element to track mouseup event if the cursor living the wheel area.
   */
  @Input('tracking-area') trackingArea?: HTMLElement;

  @Input('disabled') disabled: boolean = false;

  /**
   * Letters to display on a wheel
   */
  @Input('letters') letters: Array<string> = ['e', 'm', 'e', 'p', 't', 'y'];
  /**
   * Triggered when any letter becomes selected
   */
  @Output() onSelectLetter = new EventEmitter<[HTMLDivElement, DOMRect, string[]]>();
  /**
   * Triggered when any letter becomes unselected
   */
  @Output() onUnselectLetter = new EventEmitter<[HTMLDivElement[], DOMRect[], string[]]>();
  /**
   * Triggered on selection reset with last selected data
   */
  @Output() onEndSelection = new EventEmitter<[HTMLDivElement[], DOMRect[], string[]]>();
  @ViewChildren('letter') uiLetters!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('wheel') uiWheel!: ElementRef<HTMLDivElement>;

  showOnUI = false;
  selected: Array<ElementRef<HTMLDivElement> | undefined> = [];
  offFns: Array<CallableFunction> = [];
  letterRectangles: DOMRect[] = [];


  ngOnChanges(changes: SimpleChanges): void {
    this.offFns.forEach(fn => fn())
    this.offFns = [];
    requestAnimationFrame(() => {
      const letters = this.uiLetters.map(l => l.nativeElement);
      this.updateLetterRectangles(letters);
      this.bindEvents(letters);
    });
  }

  ngAfterViewInit(): void {
    const letters = this.uiLetters.map(l => l.nativeElement);
    this.updateLetterRectangles(letters);
    this.bindEvents(letters);

    requestAnimationFrame(() => {
      this.showOnUI = true;
    });
  }

  ngOnDestroy(): void {
    this.offFns?.splice(0).forEach(fn => fn());
  }

  public isSelected(index: number) {
    return this.selected.includes(this.uiLetters?.get(index));
  }

  private getSelection() {
    return this.selected.map(
      (_, index) => this.letters[this.toUiIndex(index)]
    )
  }

  /**
   * Select element by index of uiLetters array
   * @param index
   */
  private select(index: number) {
    if (!this.isSelected(index)) {
      const uiLetter = this.uiLetters?.get(index);
      if (uiLetter) {
        this.selected.push(uiLetter);
        this.onSelectLetter.emit(
          [
            uiLetter.nativeElement,
            this.letterRectangles[index],
            this.getSelection()
          ]
        );
      }
    }
  }




  /**
   * Select element by index, or deselect the tail of selection
   * @param index
   */
  private smartToggle(index: number) {
    if (!this.isSelected(index)) {
      this.select(index);
    } else {
      this.unselect(this.toSelectionIndex(index) + 1);
    }
  }

  /**
   * Deselect the element from selection array
   * @param index - index in selection array
   * @param count - count to deselect
   */
  private unselect(index: number, count: number = Infinity, notify = true) {
    if (this.selected.length < index + 1) return;

    const unselects = this.selected.splice(index, count).map(l => l!.nativeElement);
    const rects = unselects.map((_, unselectIndex) => this.letterRectangles[index + unselectIndex]);
    this.onUnselectLetter.emit([
      unselects,
      rects,
      this.getSelection()
    ]);
  }

  private endSelection() {
    if (this.selected.length) {
      const uiLettersArray  = this.uiLetters.toArray();
      const indexes = this.selected.map((el, index) => this.toUiIndex(index, uiLettersArray));
      this.onEndSelection.emit([
        this.selected.map(el => el!.nativeElement),
        indexes.map(index => this.letterRectangles[index]),
        indexes.map(index => this.letters[index]),
      ])

      this.unselect(0);
    }
  }

  /**
   * convert uiLetter index to selection index;
   * @param index - index of ui element
   * @returns {number} - index of selection if exists
   */
  private toSelectionIndex(index: number): number {
    return this.selected.indexOf(this.uiLetters.get(index));
  }

  /**
   * convert uiLetter index to selection index;
   * @param index - index of selection
   * @returns {number} - index of Ui element
   */
  private toUiIndex(index: number, uiLetters?: any[]): number {
    return (uiLetters || this.uiLetters.toArray()).indexOf(this.selected[index]);
  }


  public processEvent(event: Event) {
    if (this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    let index = parseInt((event.target as HTMLDivElement).id.replace('letter-', ''));
    if ('mousedown' === event.type) {
      if (!this.selected.length) {
        this.select(index);
      }

      return;
    }

    if ('touchstart' === event.type) {
      if (!this.selected.length) {
        this.select(index);
      }

      return;
    }

    if ('mouseenter' === event.type) {
      if (this.selected.length) {
        this.smartToggle(index);
      }
      return;
    }

    if ('touchmove' === event.type) {
      if (this.selected.length) {
        const hoveredIndex = this.getHoveredLetterIndex(event as TouchEvent);
        if (hoveredIndex === -1) return;
        this.smartToggle(hoveredIndex);
      }
      return;
    }

    if ('mouseup' === event.type) {
      this.endSelection()
      return;
    }

    if ('touchend' === event.type) {
      this.endSelection()
      return;
    }
  }

  private updateLetterRectangles(letters: Array<HTMLDivElement>) {
    this.letterRectangles = this.setPositions(letters);
  }

  private setPositions(letters: Array<HTMLDivElement>): DOMRect[] {
    const {
      height,
      width,
      x,
      y
    } = this.uiWheel.nativeElement.getBoundingClientRect();
    const r = height/2;

    return letters.map((letter, index) => {
      const alpha = -.5*Math.PI + 2*Math.PI/letters.length * index;

      Object.assign(letter.style, {
        position: 'absolute',
        left: `${r + r*Math.cos(alpha)}px`,
        top: `${r + r*Math.sin(alpha)}px`,
      } as CSSStyleDeclaration)

      const rect = letter.getBoundingClientRect();
      return {
        ...rect,
        x: rect.x,
        y: rect.y,
        height: rect.height,
        width: rect.width,
      }
    })
  }

  private bindEvents(letters: Array<HTMLDivElement>) {
    const handler = this.processEvent.bind(this);

    WheelComponent.EVENTS.forEach((event) => {
      this.uiLetters.forEach(uiLetter => {
        uiLetter.nativeElement.addEventListener(event, handler)
        this.offFns.push(() => {
          uiLetter.nativeElement.removeEventListener(event, handler);
        });
      })
    });

    const trackingElement = this.trackingArea || this.uiWheel.nativeElement;
    trackingElement.addEventListener('mouseup', handler)
    this.offFns.push(() => {
      trackingElement.removeEventListener('mouseup', handler);
    });

    const setPositionsHandler = () => {
      this.updateLetterRectangles(this.uiLetters.map(letter => letter.nativeElement));
    }
    window.addEventListener('resize', setPositionsHandler)
    this.offFns.push(() => {
      window.removeEventListener('resize', setPositionsHandler);
    })
  }

  private getHoveredLetterIndex(event: TouchEvent): number {
    const {pageX, pageY} = event.touches[0];
    return this.letterRectangles.findIndex(rect => {
      return (pageX > rect.x
        && pageX < (rect.x + rect.width)
        && pageY > rect.y
        && pageY < (rect.y + rect.height));
    })
  }
}
