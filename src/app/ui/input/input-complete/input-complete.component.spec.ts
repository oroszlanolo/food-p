import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCompleteComponent } from './input-complete.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('InputCompleteComponent', () => {
  let component: InputCompleteComponent;
  let fixture: ComponentFixture<InputCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCompleteComponent],
        providers: [
          provideHttpClient(),
          provideAnimationsAsync(),
        ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
