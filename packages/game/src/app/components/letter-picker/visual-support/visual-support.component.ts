import { AfterViewInit, Component, ElementRef, Host, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-visual-support',
  standalone: true,
  imports: [],
  templateUrl: './visual-support.component.html',
  styleUrl: './visual-support.component.scss'
})
export class VisualSupportComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') container!: ElementRef<HTMLElement>;

  context!: CanvasRenderingContext2D;
  // facade!: LetterPickerFacade;

  nodes: [number, number, Object?][] = [];

  animation?: Promise<void>;

  offFns: CallableFunction[] = [];

  ngAfterViewInit(): void {
    this.adjustSize();
    this.context = this.canvas!.nativeElement.getContext('2d')!;

    const adjust = this.adjustSize.bind(this);
    window.addEventListener('resize', adjust)
    this.offFns.push(() => window.removeEventListener('resize', adjust));
  }

  ngOnDestroy(): void {
    this.offFns.splice(0).forEach(fn => fn());
  }

  addNode([x, y]: [number, number], id?: Object) {
    this.nodes.push([x,y,id]);
  }

  removeNode([x, y]: [number, number], id?: Object) {
    const index = this.nodes.findIndex(([nx, ny, nId]) => {
      if (id) {
        return nId === id
      } else {
        return nx === x && ny === y;
      }
    });
    this.nodes.splice(index, 1);
  }

  async connectNodes(): Promise<void> {
    for(const [x, y] of this.nodes) {
      this.continueLine(x, y);
    }
  }

  disconnectNodes(): void {
    this.clear();
  }

  private adjustSize() {
    requestAnimationFrame(() => {
      const {width, height} = this.container.nativeElement.getBoundingClientRect();
      Object.assign(this.canvas.nativeElement, {width: width * 2, height: height *2, top: 0, left: 0});
    })
  }

  private async continueLine(x: number, y: number) {
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'lightblue';
    this.context.lineTo(x, y);
    this.context.stroke();

    this.animation = new Promise<void>(async resolve => {
      do {
        await new Promise(resolve => requestAnimationFrame(resolve));
        this.context.lineWidth ++ ;
        this.context.stroke();
      } while (this.context.lineWidth < 16);
      resolve();
    });

    await this.animation;
    this.animation = undefined;
  }

  private async clear() {
    const {height, width} = this.canvas.nativeElement.getBoundingClientRect();
    this.context.clearRect(0, 0, width*2, height*2);
    this.context.reset();
  }
}
