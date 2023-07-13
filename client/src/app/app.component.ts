import { Component, Inject, OnInit } from '@angular/core';
import { TrpcService } from './trpc.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spamd', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

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
