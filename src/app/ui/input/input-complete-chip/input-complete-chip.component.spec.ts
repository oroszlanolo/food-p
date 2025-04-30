import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCompleteChipComponent } from './input-complete-chip.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('InputCompleteChipComponent', () => {
  let component: InputCompleteChipComponent;
  let fixture: ComponentFixture<InputCompleteChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCompleteChipComponent],
      providers: [
        provideHttpClient(),
        provideAnimationsAsync(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCompleteChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
