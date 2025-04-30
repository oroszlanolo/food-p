import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCompleteChipComponent } from './input-complete-chip.component';

describe('LabelPickerComponent', () => {
  let component: InputCompleteChipComponent;
  let fixture: ComponentFixture<InputCompleteChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCompleteChipComponent]
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
