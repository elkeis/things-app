import { Component, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { initialState } from 'src/app/store/session';
import { TrpcService } from 'src/app/services//trpc.service';

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
