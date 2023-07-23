import { Component, Inject, OnInit } from '@angular/core';
import { TrpcService } from './trpc.service';
import { SessionService } from './services/session.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private trpc: TrpcService,
    private session: SessionService,
  ) {}


  async ngOnInit() {
  }
}
