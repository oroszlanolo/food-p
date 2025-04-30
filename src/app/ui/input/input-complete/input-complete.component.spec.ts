import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCompleteComponent } from './input-complete.component';

describe('InputCompleteComponent', () => {
  let component: InputCompleteComponent;
  let fixture: ComponentFixture<InputCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCompleteComponent]
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
