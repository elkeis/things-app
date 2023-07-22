import { Component, Inject, OnInit } from '@angular/core';
import { TrpcService } from './trpc.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public ghUrl = 'no url'

  constructor(@Inject(TrpcService) private trpc: TrpcService) {}


  async ngOnInit() {
      const hello = await this.fetchHello();
      console.log('hello');
      this.ghUrl = hello;
  }
  async fetchHello() {
    return await this.trpc.client.github.getAuthUrl.query();
  }
}
