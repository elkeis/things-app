import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaleTabPopupComponent } from './stale-tab-popup.component';

describe('StaleTabPopupComponent', () => {
  let component: StaleTabPopupComponent;
  let fixture: ComponentFixture<StaleTabPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaleTabPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaleTabPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
