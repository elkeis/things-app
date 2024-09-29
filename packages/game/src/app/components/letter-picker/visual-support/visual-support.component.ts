import { AfterViewInit, Component, ElementRef, Host, Input, OnDestroy, ViewChild } from '@angular/core';
import { isArray } from 'lodash';

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

  @Input('ratio') ratio: number = .5;

  context!: CanvasRenderingContext2D;
  // facade!: LetterPickerFacade;

  nodes: [number, number, Object?][] = [];

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
    this.nodes.push([
      ...this.pageToCanvas([x,y])
      ,id
    ]);
  }

  async registerMousemove(x: number, y:number) {
    if(this.nodes.length) {
      this.disconnectNodes();
      this.connectNodes();
      this.continueLine(...this.pageToCanvas([x, y]));
    }
  }

  removeNode([x, y]: [number, number], id?: Object) {
    [x, y] = this.pageToCanvas([x,y]);
    const index = this.nodes.findIndex(([nx, ny, nId]) => {
      if (id) {
        return nId === id
      } else {
        return nx === x && ny === y;
      }
    });
    this.nodes.splice(index, 1);
  }

  connectNodes(): void{
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
      const [aWidth, aHeight] = this.pageToCanvas([width, height]);
      Object.assign(this.canvas.nativeElement, {
        width: aWidth,
        height: aHeight,
        top: 0,
        left: 0
      });
    })
  }

  private continueLine(x: number, y: number) {
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.lineWidth = 16;
    this.context.strokeStyle = 'lightblue';
    this.context.lineTo(x, y);
    this.context.stroke();
  }

  private async clear() {
    const {height, width} = this.canvas.nativeElement.getBoundingClientRect();
    this.context.clearRect(0, 0, ...this.pageToCanvas([width, height]));
    this.context.reset();
  }

  private pageToCanvas<T extends (number | [number, number])>(
    values: T
  ): T {
    if (isArray(values)) {
      return values.map(v => Math.round(v/this.ratio)) as T;
    } else {
      return Math.round(values as number/this.ratio) as T;
    }
  }
}
