import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThingsPage } from './things.page';

describe('ThingsPage', () => {
  let component: ThingsPage;
  let fixture: ComponentFixture<ThingsPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(ThingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
