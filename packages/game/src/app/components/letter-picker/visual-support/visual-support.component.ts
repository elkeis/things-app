import { AfterViewInit, Component, ElementRef, Host, ViewChild } from '@angular/core';
import { LetterPickerFacade } from './LetterPickerFacade';

@Component({
  selector: 'app-visual-support',
  standalone: true,
  imports: [],
  templateUrl: './visual-support.component.html',
  styleUrl: './visual-support.component.scss'
})
export class VisualSupportComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') container!: ElementRef<HTMLElement>;

  context!: CanvasRenderingContext2D;
  // facade!: LetterPickerFacade;

  nodes: [number, number, Object?][] = [];

  animation?: Promise<void>;

  ngAfterViewInit(): void {
    const {width, height} = this.container.nativeElement.getBoundingClientRect();
    Object.assign(this.canvas.nativeElement, {width: width * 2, height: height *2, top: 0, left: 0});

    this.context = this.canvas!.nativeElement.getContext('2d')!;
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
