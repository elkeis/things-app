import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterPickerComponent } from './letter-picker.component';

describe('LetterPickerComponent', () => {
  let component: LetterPickerComponent;
  let fixture: ComponentFixture<LetterPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetterPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
