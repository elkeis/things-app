declare interface ILetterPickerFacade extends EventTarget {

}

export class LetterPickerFacade extends EventTarget  implements ILetterPickerFacade{

  canvasOffset: [number, number];
  lastPoint: [number, number] = [0, 0];

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly ctsdpir: number = 2
  ){
    super();

    const {x, y} = canvas.getBoundingClientRect();
    this.canvasOffset = [x, y];
    this.ctx.strokeStyle = 'pink';
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    // this.ctx.translate(.5, .5);
  }

  /**
   *
   * @param canvas Canvas Html element
   * @param ctsdpir Canvas to Screen DPI ratio
   * @returns {LetterPickerFacade} - class instance
   */
  public static create(
    canvas: HTMLCanvasElement,
    ctsdpir?: number) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('[LetterPickerFacade.create]: canvas.getContext() returned null');
    }

    return new LetterPickerFacade(canvas, ctx, ctsdpir);
  }



  // public startLine(x: number, y: number) {
  //   this.ctx.strokeStyle = 'pink';
  //   this.ctx.lineWidth = 1;
  //   // this.ctx.fillText('some', 5,50);
  //   this.ctx.moveTo(x, y);
  // }

  public async continueLine(x: number, y: number) {
    // if (this.lastPoint[0] + this.lastPoint[1] === 0) this.lastPoint = [x,y];
    do {
      // this.ctx.beginPath();
      console.log(this.lastPoint);
      // this.ctx.moveTo(...this.lastPoint);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } while (await this.animateStroke());
    this.lastPoint = [x, y];
  }

  // public async endLine(x?: number, y?: number) {
  //   if (x && y) {
  //     this.continueLine(x, y);
  //   }

  //   do {
  //     this.ctx.strokeStyle = 'pink';
  //     this.ctx.lineWidth++;
  //     this.ctx.stroke();
  //     await new Promise(resolve => requestAnimationFrame(resolve));
  //   } while (this.ctx.lineWidth < 25)



  //   // setTimeout(() => {
  //   //   this.ctx.reset();
  //   //   this.ctx.moveTo(0, 0);
  //   // }, 300);
  //   // this.ctx.clearRect(0, 0, 10000, 10000);
  // }

  public clear() {
    this.lastPoint = [0, 0];
    this.ctx.reset();
  }

  private touchToPoint(touch: Touch): [number, number] {
    const x = touch.clientX - this.canvasOffset[0];
    const y = touch.clientY - this.canvasOffset[1];
    return [x*2, y*2];
  }

  // public subscribeOnTouch() {
  //   this.canvas.addEventListener('touchstart', (event) => {
  //     console.log(event.touches);

  //     this.startLine(...this.touchToPoint(event.touches[0]));
  //   });

  //   this.canvas.addEventListener('touchmove', (event) => {
  //     console.log(event.touches);
  //     this.continueLine(...this.touchToPoint(event.touches[0]));
  //   });

  //   this.canvas.addEventListener('touchend', (event) => {
  //     console.log(event.touches);
  //     this.endLine();
  //   });
  // }

  private async animateStroke() {
    this.ctx.lineWidth++;
    await new Promise(resolve => requestAnimationFrame(resolve));
    return this.ctx.lineWidth < 16;
  }
}
