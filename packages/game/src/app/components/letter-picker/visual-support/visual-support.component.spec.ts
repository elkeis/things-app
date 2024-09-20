import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualSupportComponent } from './visual-support.component';

describe('VisualSupportComponent', () => {
  let component: VisualSupportComponent;
  let fixture: ComponentFixture<VisualSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
