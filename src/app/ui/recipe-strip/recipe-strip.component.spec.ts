import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStripComponent } from './recipe-strip.component';

describe('RecipeStripComponent', () => {
  let component: RecipeStripComponent;
  let fixture: ComponentFixture<RecipeStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeStripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
