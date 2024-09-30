import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { LevelComponent } from "./scenes/level/level.component";
import { HurrayScreenComponent } from "./scenes/hurray-screen/hurray-screen.component";
import { StaleTabPopupComponent } from "./components/stale-tab-popup/stale-tab-popup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComponentsModule, LevelComponent, HurrayScreenComponent, StaleTabPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {

  @ViewChild(HurrayScreenComponent) hurrayScreen!: HurrayScreenComponent;

  title = 'game';
  showCongratulations = false;
  level = 1;
  isViewStale = false;

  async processLevelComplete() {
    this.showCongratulations = true;
    requestAnimationFrame(async () => {
      await this.hurrayScreen.animateShow();
    });
  }

  async processHurrayScreenSubmit() {
    requestAnimationFrame(async () => {
      await this.hurrayScreen.animateHide();
      this.showCongratulations = false;
    });
    this.level ++;
  }

  processGameInStaleNotification() {
    this.isViewStale = true;
  }

  windowRefresh() {
    location.reload();
  }
}
