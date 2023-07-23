import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizePage } from './authorize.page';

describe('AuthorizePage', () => {
  let component: AuthorizePage;
  let fixture: ComponentFixture<AuthorizePage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(AuthorizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
