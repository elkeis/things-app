import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsGameViewComponent } from './words-game-view.component';

describe('WordsGameViewComponent', () => {
  let component: WordsGameViewComponent;
  let fixture: ComponentFixture<WordsGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsGameViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
