import { AsyncPipe, Location, NgClass, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, model, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { getDefaultRecipe, Recipe } from '../../../../models/recipe.model';
import { DishTypePipe } from '../../../pipes/dish-type.pipe';
import { FoodPropertyService } from '../../../services/food-property.service';
import { FoodService } from '../../../services/food.service';
import { ImageService } from '../../../services/image.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationDialogComponent } from '../../../ui/dialog/confirmation-dialog/confirmation-dialog.component';
import { InputCompleteChipComponent } from '../../../ui/input/input-complete-chip/input-complete-chip.component';
import { InputCompleteComponent } from '../../../ui/input/input-complete/input-complete.component';
import { FormHelper } from './form-helper';
import { FormGroupControls, IngredientControls } from './recipe-form.model';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    TitleCasePipe,
    DishTypePipe,
    AsyncPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    InputCompleteChipComponent,
    MatSnackBarModule,
    InputCompleteComponent,
  ],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss',
})
export class EditRecipeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private foodService = inject(FoodService);
  private imgService = inject(ImageService);
  private user = inject(UserService);
  private location = inject(Location);
  private dialog = inject(MatDialog);
  private foodPropertyService = inject(FoodPropertyService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  recipeServerUrl = environment.serverPath;
  id = '';
  recipe?: Recipe;
  object = Object;
  editingExistingRecipe = false;

  sectionCreationIdx = 0;
  selectedSection = model(0);
  newSectionName = model('');

  get loggedIn() {
    return this.user.loggedIn;
  }
  availableDishTypes = this.foodPropertyService.getDishTypeList();
  availableWhens = this.foodPropertyService.getWhenList();
  availableAllergens = this.foodPropertyService.getAllergenList();

  recipeForm: FormGroup<FormGroupControls> = this.fb.group({
    name: ['', Validators.required],
    serving: [0, Validators.required],
    url: '',
    difficulty: 'easy',
    dishType: '',
    when: '',
    preparationTime: this.fb.group({
      preparation: 0,
      owen: 0,
      cooking: 0,
      total: [{ value: 0, disabled: true }],
    }),
    temperature: 0,
    allergens: '',
    labels: '',
    sections: this.fb.array([
      this.fb.group({
        name: 'Main',
        ingredients: this.fb.array<FormGroup<IngredientControls>>([]),
        directions: this.fb.array<string>([]),
      }),
    ]),
  });

  formHelper!: FormHelper;

  get sections() {
    return this.recipeForm.get('sections') as FormArray;
  }

  addSection() {
    if (this.newSectionName()) {
      this.formHelper.addSection(this.newSectionName(), this.selectedSection() + 1);
      this.newSectionName.set('');
      this.selectedSection.update((s) => s + 1);
    }
  }

  removeCurrentSection() {
    if (this.sections.length <= 1) {
      return;
    }
    this.formHelper.removeSection(this.selectedSection());
    this.selectedSection.update((s) => s - 1);
  }

  moveSectionUp() {
    if (this.selectedSection() > 0) {
      this.formHelper.moveSectionUp(this.selectedSection());
      this.selectedSection.update((s) => s - 1);
    }
  }
  moveSectionDown() {
    if (this.selectedSection() < this.sections.length - 1) {
      this.formHelper.moveSectionDown(this.selectedSection());
      this.selectedSection.update((s) => s + 1);
    }
  }

  addIngredientToCurrentSection(name = '', quantity = 0, unit = '', note = '') {
    this.formHelper.addIngredient(this.selectedSection(), name, quantity, unit, note);
  }
  removeIngredient(i: number) {
    this.formHelper.removeIngredient(this.selectedSection(), i);
  }

  ingredientCanBeMovedUp(ingredientIdx: number) {
    return this.formHelper.ingredientCanBeMovedUp(this.selectedSection(), ingredientIdx);
  }
  ingredientCanBeMovedDown(ingredientIdx: number) {
    return this.formHelper.ingredientCanBeMovedDown(this.selectedSection(), ingredientIdx);
  }
  moveIngredientUp(ingredientIdx: number) {
    this.formHelper.moveIngredientUp(this.selectedSection(), ingredientIdx);
  }
  moveIngredientDown(ingredientIdx: number) {
    this.formHelper.moveIngredientDown(this.selectedSection(), ingredientIdx);
  }

  addDirectionToCurrentSection(dir: string = '') {
    this.formHelper.addDirection(this.selectedSection(), dir);
  }
  removeDirection(i: number) {
    this.formHelper.removeDirection(this.selectedSection(), i);
  }

  directionCanBeMovedUp(i: number) {
    return this.formHelper.directionCanBeMovedUp(this.selectedSection(), i);
  }
  directionCanBeMovedDown(i: number) {
    return this.formHelper.directionCanBeMovedDown(this.selectedSection(), i);
  }
  moveDirectionUp(i: number) {
    this.formHelper.moveDirectionUp(this.selectedSection(), i);
  }
  moveDirectionDown(i: number) {
    this.formHelper.moveDirectionDown(this.selectedSection(), i);
  }

  ngOnInit(): void {
    const preparationTimeGroup = this.recipeForm.get('preparationTime') as FormGroup;

    const timeSub = preparationTimeGroup.valueChanges.subscribe((values) => {
      const { preparation, owen, cooking } = values;
      const total = (preparation || 0) + (owen || 0) + (cooking || 0);
      preparationTimeGroup.get('total')?.setValue(total, { emitEvent: false });
    });

    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (window.history.state?.recipe) {
      this.setRecipe(window.history.state.recipe);
    }
    if (window.history.state?.editingExistingRecipe) {
      this.editingExistingRecipe = true;
    }
    if (window.history.state?.url) {
      // TODO: store url?
    }

    let getRecipeSub: Subscription;

    if (this.id !== '' && !this.recipe) {
      getRecipeSub = this.foodService.getRecipe(this.id).subscribe((recipe) => {
        this.setRecipe(recipe);
      });
    }
    if (this.recipe?._id) {
      this.id = this.recipe?._id;
    }

    if (!this.recipe) {
      this.setRecipe(getDefaultRecipe());
    }
    this.destroyRef.onDestroy(() => {
      timeSub.unsubscribe();
      getRecipeSub?.unsubscribe();
    });
  }

  setRecipe(recipe: Recipe) {
    this.recipe = recipe;
    this.formHelper = new FormHelper(this.fb, this.recipeForm, this.recipe);
    this.formHelper.updateRecipeForm();
  }

  addRecipe() {
    console.log(this.recipe);
    if (this.recipe) {
      this.foodService.addOrUpdateRecipe(this.recipe).subscribe({
        next: (id) => {
          console.log('id', id);
          this.snackBar.open('Recipe saved', 'Close', { duration: 5000, horizontalPosition: 'right' });
          this.router.navigate([`/recipe/${id}`]);
        },
        error: (err) => console.log(err),
      });
    }
  }

  addImg(event: Event) {
    this.imgService.addImage(event).subscribe((resp) => {
      console.log(resp);
      this.recipe?.images.push(resp);
      console.log(this.recipe);
    });
  }

  validateRecipe(): boolean {
    return true; // TODO
  }

  onSubmit() {
    this.formHelper.updateRecipeFromForm();
    console.log(this.recipe);
    // this.addRecipe();
  }

  onCancel() {
    this.location.back();
  }

  onDelete() {
    if (this.recipe?._id) {
      this.dialog
        .open(ConfirmationDialogComponent, {
          data: {
            title: 'Delete Recipe',
            message: 'Are you sure you want to delete this recipe?',
          },
        })
        .afterClosed()
        .subscribe((confirmed) => {
          if (confirmed) {
            this.doDelete();
          }
        });
    }
  }

  doDelete() {
    if (this.recipe?._id) {
      this.foodService.deleteRecipe(this.recipe._id).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/recipes']);
          } else {
            console.log('Could not delete recipe');
          }
        },
        error: (err) => console.log(err),
      });
    }
  }
}
