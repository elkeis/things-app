import { Component, OnInit } from '@angular/core';
import { TrpcService } from '../../trpc.service';
import { Router } from '@angular/router';
import { decodeJwt } from 'jose';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.page.html',
  styleUrls: ['./authorize.page.scss'],
})
export class AuthorizePage implements OnInit {

  public code = '';


  constructor(
    private trpc: TrpcService,
    private session: SessionService,
    private router: Router,
  ) { }

  async ngOnInit() {
    if (this.session.getAuth()) {
      this.router.navigate(['/'])
      return;
    }

    const urlTree = this.router.parseUrl(this.router.url);
    this.code = urlTree.queryParams['code'];
    if (!this.code) {
      this.router.navigate(['/'])
      return;
    }
    const {access_token} = await this.trpc.client.session.login.query({
      githubCode: this.code,
      redirect_url: document.location.href.split('?')[0]
    });

    this.session.setAuth(access_token);
    this.router.navigate(['/'])
  }

}
