import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStripComponent } from './recipe-strip.component';
import { provideHttpClient } from '@angular/common/http';

describe('RecipeStripComponent', () => {
  let component: RecipeStripComponent;
  let fixture: ComponentFixture<RecipeStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeStripComponent],
      providers: [provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeStripComponent);
    fixture.componentRef.setInput('homeType', 'random');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
