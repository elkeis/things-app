import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnDestroy, AfterViewInit {



  @ViewChild('button') button!: ElementRef<HTMLButtonElement>;

  @Input() text: string = 'default button';

  @Input() size: 'small' | 'large' | 'medium' = 'medium';

  @Output('onPress') onPress = new EventEmitter<void>();

  clickStart: number = Infinity;
  clickTimer?: ReturnType<typeof setTimeout>;
  offFns: CallableFunction[] = [];

  ngAfterViewInit(): void {
    const clickAttempt = this.processClickAttempt.bind(this);
    const commitClick = this.commitClick.bind(this);

    this.button.nativeElement.addEventListener('touchstart', clickAttempt);
    this.button.nativeElement.addEventListener('touchend', commitClick);

    this.offFns.push(() => {
      this.button.nativeElement.removeEventListener('touchstart', clickAttempt);
      this.button.nativeElement.removeEventListener('touchEnd', commitClick);
    })
  }

  ngOnDestroy(): void {
    this.offFns.splice(0).forEach(fn => fn());
  }

  processClickAttempt() {
    this.button.nativeElement.classList.add('click');
    this.clickStart = Date.now();
  }

  commitClick() {
    this.button.nativeElement.classList.remove('click');
    const clickTime = Date.now() - this.clickStart;
    if (clickTime >= 150) {
      this.onPress.emit();
    }
    this.clickStart = Infinity;
  }


  processClick() {
    if (this.clickStart === Infinity) {
      this.processClickAttempt();
    } else {
      this.commitClick();
    }
  }
}
