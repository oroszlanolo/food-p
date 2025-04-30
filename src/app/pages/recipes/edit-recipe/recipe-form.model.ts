import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface IngredientControls {
    name: FormControl<string | null>;
    quantity: FormControl<number | null>;
    unit: FormControl<string | null>;
    note: FormControl<string | null>;
  }
  
  export interface FormGroupControls {
    name: FormControl<string | null>;
    serving: FormControl<number | null>;
    url: FormControl<string | null>;
    difficulty: FormControl<string | null>;
    dishType: FormControl<string | null>;
    when: FormControl<string | null>;
    preparationTime: FormGroup<{
      preparation: FormControl<number | null>;
      owen: FormControl<number | null>;
      cooking: FormControl<number | null>;
      total: FormControl<number | null>;
    }>;
    temperature: FormControl<number | null>;
    allergens: FormControl<string | null>;
    labels: FormControl<string | null>;
    sections: FormArray<
      FormGroup<{
        name: FormControl<string | null>;
        ingredients: FormArray<FormGroup<IngredientControls>>;
        directions: FormArray<FormControl<string | null>>;
      }>
    >;
  }