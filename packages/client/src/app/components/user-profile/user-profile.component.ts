import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {
  @Input() user: {
    name: string,
    avatar_url: string,
  } | undefined | null;

  @Input() showInProgress: boolean = false;

  @Output() login = new EventEmitter<'github'>();

  constructor() { }

  ngOnInit() {}

  loginWithGithub() {
    this.login.emit('github');
  }

}
