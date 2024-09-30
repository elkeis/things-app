import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HurrayScreenComponent } from './hurray-screen.component';

describe('HurrayScreenComponent', () => {
  let component: HurrayScreenComponent;
  let fixture: ComponentFixture<HurrayScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HurrayScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HurrayScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
