import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { actions, initialState } from 'src/app/store/session';
import { TrpcService } from 'src/app/trpc.service';

@Component({
  selector: 'app-user-profile-widget',
  templateUrl: './user-profile-widget.component.html',
  styleUrls: ['./user-profile-widget.component.scss'],
})
export class UserProfileWidgetComponent {

  public user$: Observable<typeof initialState['user']>;
  public showSpinner = false;

  constructor(
    private trpc: TrpcService,
    private zone: NgZone,
    private store: Store<{session: typeof initialState}>,
  ) {
    this.user$ = this.store.select(state => state.session.user)
  }

  async loginWithGithub() {
    this.zone.run(() => {
      this.showSpinner = true;
    });
    const loginUrl = await this.trpc.client.github.getAuthUrl.query();
    location.href = loginUrl;
  }

}
