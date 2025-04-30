import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Allergen, Difficulty, DishType, Label, Recipe, Section, When } from '../../../../models/recipe.model';
import { FormGroupControls } from './recipe-form.model';



export class FormHelper {
  fb!: FormBuilder;
  form!: FormGroup<FormGroupControls>;
  recipe!: Recipe;
  sectionCreationIdx = 0;

  constructor(fb: FormBuilder, form: FormGroup<FormGroupControls>, recipe: Recipe) {
    if (!fb || !form || !recipe) {
      throw new Error('FormRecipeBridge requires a FormBuilder, form and a recipe');
    }
    this.fb = fb;
    this.form = form;
    this.recipe = recipe;
    console.log(this.form);
  }

  get difficulty() {
    return this.form.get('difficulty')?.value ?? 'easy';
  }
  get sections() {
    return this.form.get('sections') as FormArray;
  }
  get dishTypes() {
    return this.form.get('dishType') as FormControl;
  }
  get whens() {
    return this.form.get('when') as FormControl;
  }
  get allergens() {
    return this.form.get('allergens') as FormControl;
  }
  get labels() {
    return this.form.get('labels') as FormControl;
  }

  getIngredientsFromSection(section: AbstractControl<any, any>) {
    return section.get('ingredients') as FormArray;
  }

  getDirectionsFromSection(section: AbstractControl<any, any>) {
    return section.get('directions') as FormArray;
  }

  
  getSection(sectionName: string) : AbstractControl<any, any> | null {
    const section = this.sections.controls.filter(c => c.get('name')?.value === sectionName)[0];
    if(!section) {
      console.log(`Could not find section with name ${sectionName}`);
      return null;
    }
    return section;
  }

  addSection(name?: string, idx?: number) {
    if (!name) {
      name = `Section ${this.sectionCreationIdx++}`;
    }
    const newSectionGroup = this.fb.group({
      name: name,
      ingredients: this.fb.array([]),
      directions: this.fb.array([]),
    });
    if (idx) {
      this.sections.insert(idx, newSectionGroup);
    } else {
      this.sections.push(newSectionGroup);
    }
  }
  
  removeSection(idx: number) {
    if(this.sections.length <= idx) {
      return;
    }
    this.sections.removeAt(idx);
  }
  
  moveSectionUp(idx: number) {
    if(idx > 0) {
      const section = this.sections.controls[idx];
      this.sections.removeAt(idx);
      this.sections.insert(idx - 1, section);
    }
  }
  moveSectionDown(idx: number) {
    if(idx < this.sections.length - 1) {
      const section = this.sections.controls[idx];
      this.sections.removeAt(idx);
      this.sections.insert(idx + 1, section);
    }
  }

  
  addIngredient(sectionIdx: number, name = '', quantity = 0, unit = '', note = '') {
    const section = this.sections.controls[sectionIdx];
    if(!section) return;
    const iArray = this.getIngredientsFromSection(section);
    if(iArray) {
      iArray.push(this.fb.group({
        quantity: quantity,
        unit: unit,
        name: name,
        note: note
      }));
    }
  }

  removeIngredient(sectionIdx: number, ingredientIdx: number) {
    const section = this.sections.controls[sectionIdx];
    if(!section) return;
    const iArray = this.getIngredientsFromSection(section);
    if(iArray) {
      iArray.removeAt(ingredientIdx);
    }
    console.log(iArray);
  }

  ingredientCanBeMovedUp(sectionIdx: number, ingredientIdx : number) {
    return ingredientIdx > 0;
  }
  ingredientCanBeMovedDown(sectionIdx: number, ingredientIdx : number) {
    const currentIngredients = this.sections.controls[sectionIdx].get('ingredients') as FormArray;
    return ingredientIdx < currentIngredients?.length - 1;
  }
  moveIngredientUp(sectionIdx: number, ingredientIdx: number) {
    const currentSection = this.sections.controls[sectionIdx].get('ingredients') as FormArray;
    if(this.ingredientCanBeMovedUp(sectionIdx, ingredientIdx)) {
      const ingredient = currentSection?.controls[ingredientIdx];
      currentSection.removeAt(ingredientIdx);
      currentSection.insert(ingredientIdx - 1, ingredient);
    }
  }
  moveIngredientDown(sectionIdx: number, ingredientIdx: number) {
    const currentSection = this.sections.controls[sectionIdx].get('ingredients') as FormArray;
    if(this.ingredientCanBeMovedDown(sectionIdx, ingredientIdx)) {
      const ingredient = currentSection?.controls[ingredientIdx];
      currentSection.removeAt(ingredientIdx);
      currentSection.insert(ingredientIdx + 1, ingredient);
    }
  }
  
  addDirection(sectionIdx: number, dir: string = '') {
    const section = this.sections.controls[sectionIdx];
    if(!section) return;
    const dArray = this.getDirectionsFromSection(section);
    if(dArray) {
      dArray.push(this.fb.control(dir));
    }
  }

  removeDirection(sectionIdx: number, i : number) {
    const section = this.sections.controls[sectionIdx];
    if(!section) return;
    const dArray = this.getDirectionsFromSection(section);
    if(dArray) {
      dArray.removeAt(i);
    }
  }

  directionCanBeMovedUp(sectionIdx: number, i: number) {
    return i > 0;
  }
  directionCanBeMovedDown(sectionIdx: number, i: number) {
    const currentDirections = this.sections.controls[sectionIdx].get('directions') as FormArray;
    return i < currentDirections?.length - 1;
  }
  moveDirectionUp(sectionIdx: number, i: number) {
    if(this.directionCanBeMovedUp(sectionIdx, i)) {
      const currentDirections = this.sections.controls[sectionIdx].get('directions') as FormArray;
      const direction = currentDirections?.controls[i];
      currentDirections.removeAt(i);
      currentDirections.insert(i - 1, direction);
    }
  }
  moveDirectionDown(sectionIdx: number, i: number) {
    if(this.directionCanBeMovedDown(sectionIdx, i)) {
      const currentDirections = this.sections.controls[sectionIdx].get('directions') as FormArray;
      const direction = currentDirections?.controls[i];
      currentDirections.removeAt(i);
      currentDirections.insert(i + 1, direction);
    }
  }
  
  updateRecipeForm() {
    if (this.recipe) {
      console.log(this.recipe);
      this.form.get('name')?.setValue(this.recipe.name);
      this.form.get('serving')?.setValue(this.recipe.serving);
      const diffControl = this.form.get('difficulty');
      diffControl?.setValue(this.recipe.difficulty);
      if (this.recipe.url) {
        this.form.get('url')?.setValue(this.recipe.url);
      }
      this.dishTypes?.setValue([...this.recipe.dishType]);
      this.allergens?.setValue([...this.recipe.allergens]);
      this.whens?.setValue([...this.recipe.when]);
      this.labels?.setValue([...this.recipe.labels]);

      if (this.recipe.preparationTime.preparation) {
        this.form
          .get('preparationTime')
          ?.get('preparation')
          ?.setValue(this.recipe.preparationTime.preparation);
      }
      if (this.recipe.preparationTime.owen) {
        this.form
          .get('preparationTime')
          ?.get('owen')
          ?.setValue(this.recipe.preparationTime.owen);
      }
      if (this.recipe.preparationTime.cooking) {
        this.form
          .get('preparationTime')
          ?.get('cooking')
          ?.setValue(this.recipe.preparationTime.cooking);
      }
      if (this.recipe.preparationTime.total) {
        this.form
          .get('preparationTime')
          ?.get('total')
          ?.setValue(this.recipe.preparationTime.total);
      }
      if (this.recipe.temperature) {
        this.form.get('temperature')?.setValue(this.recipe.temperature);
      }

      for (let i = 0; i < this.recipe.sections.length; i++) {
        const section = this.recipe.sections[i];
        if(i > 0)
          this.addSection();
        console.log(this.sections.controls);
        this.sections.controls[i].get('name')?.setValue(section.name);
        const sectionName = this.sections.controls[i].get('name')!.value;
        for(let ingredient of section.ingredients) {
          this.addIngredient(i, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.note);
        }
        for(let direction of section.directions) {
          this.addDirection(i, direction);
        }
      }
    }
  }
  updateRecipeFromForm() {
    console.log(this.form);
    if(this.recipe) {
      const name = this.form.get('name')!.value;
      if(name != null) this.recipe.name = name;
      const serving = this.form.get('serving')!.value;
      if(serving != null) this.recipe.serving = serving;

      this.recipe.difficulty = this.difficulty as Difficulty;

      if(this.form.get('url')?.value) {
        this.recipe.url = this.form.get('url')!.value as string;
      }

      if(this.dishTypes?.value) {
        this.recipe.dishType = this.dishTypes?.value as DishType[];
      }
      if(this.allergens?.value) {
        this.recipe.allergens = this.allergens?.value as Allergen[];
      }
      if(this.whens?.value) {
        this.recipe.when = this.whens?.value as When[];
      }
      if(this.labels?.value) {
        this.recipe.labels = this.labels?.value as Label[];
      }

      const prep = this.form.get('preparationTime')?.get('preparation')?.value;
      if(prep != null && prep != 0) this.recipe.preparationTime.preparation = prep;
      const owen = this.form.get('preparationTime')?.get('owen')?.value;
      if(owen != null && owen != 0) this.recipe.preparationTime.owen = owen;
      const cooking = this.form.get('preparationTime')?.get('cooking')?.value;
      if(cooking != null && cooking != 0) this.recipe.preparationTime.cooking = cooking;
      const total = this.form.get('preparationTime')?.get('total')?.value;
      if(total != null && total != 0) this.recipe.preparationTime.total = total;
      const temperature = this.form.get('temperature')?.value;
      if(temperature != null && temperature != 0) this.recipe.temperature = temperature;

      const sections : Section[] = this.sections.value;
      this.recipe.sections = sections;
    }
  }
}
