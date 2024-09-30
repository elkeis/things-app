import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ButtonComponent } from "../../components/essentials/button/button.component";
import { transform } from 'lodash';

@Component({
  selector: 'app-hurray-screen',
  standalone: true,
  imports: [ComponentsModule, ButtonComponent],
  templateUrl: './hurray-screen.component.html',
  styleUrl: './hurray-screen.component.scss'
})
export class HurrayScreenComponent {
  @ViewChild('screen') screen!: ElementRef<HTMLDivElement>;

  @Input('levelNumber') levelNumber: number = 0;
  @Input('nextLevelNumber') nextLevelNumber: number = 0;

  @Output('onSubmit') onSubmit = new EventEmitter<void>();

  public async animateShow() {
    await new Promise<void>(resolve => {
      this.screen.nativeElement.animate([
        {
          transform: 'translate3d(0, -110%, 0)',
          offset: 0,
        },

        {
          transform: 'translate3d(0, 0, 0)',
          offset: .7,
        },
        {
          transform: 'translate3d(0, -15%, 0)',
          offset: .8,
        },
        {
          transform: 'translate3d(0, 0, 0)',
          offset: .9,
        },
        {
          transform: 'translate3d(0, -7%, 0)',
          offset: .95,
        },
        {
          transform: 'translate3d(0, 0, 0)',
          offset: .97,
        },
        {
          transform: 'translate3d(0, -3%, 0)',
          offset: .99,
        },
        {
          transform: 'translate3d(0, 0, 0)',
          offset: 1,
        },
      ], {
        easing: 'ease',
        duration: 700,
        fill: 'forwards'
      }).onfinish = () => {
        this.screen.nativeElement.classList.remove('hidden');
        resolve();
      }
    })
  }

  public async animateHide() {
    await new Promise<void>(resolve => {
      this.screen.nativeElement.animate([
        {
          transform: 'translate3d(0, 0, 0)',
          offset: 0,
        },
        {
          transform: 'translate3d(0, 110%, 0) rotate(60deg)',
          offset: 1,
        }
      ], {
        fill: 'forwards',
        duration: 500,
      }).onfinish = () => {
        this.screen.nativeElement.classList.add('hidden');
        resolve();
      }
    })
  }

  processSubmit() {
    this.onSubmit.emit();
  }
}
