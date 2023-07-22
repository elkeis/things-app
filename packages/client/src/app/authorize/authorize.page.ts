import { Component, OnInit } from '@angular/core';
import { TrpcService } from '../trpc.service';
import { Router } from '@angular/router';
import { decodeJwt } from 'jose';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.page.html',
  styleUrls: ['./authorize.page.scss'],
})
export class AuthorizePage implements OnInit {

  public code = '';
  public userData = {};


  constructor(
    private trpc: TrpcService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const urlTree = this.router.parseUrl(this.router.url);
    this.code = urlTree.queryParams['code'];
    const {access_token} = await this.trpc.client.session.login.query({
      githubCode: this.code,
      redirect_url: document.location.href.split('?')[0]
    });

    this.trpc.setAuth(access_token);
    this.userData = await decodeJwt(access_token);
    alert(await this.trpc.client.example.hello.query());
  }

}
