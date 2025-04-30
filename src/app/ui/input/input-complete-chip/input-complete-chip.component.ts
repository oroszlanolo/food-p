import { Component, computed, DestroyRef, forwardRef, inject, input, model, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FoodPropertyService } from '../../../services/food-property.service';

@Component({
  selector: 'app-input-complete-chip',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCompleteChipComponent),
      multi: true
    }
  ],
  templateUrl: './input-complete-chip.component.html',
  styleUrl: './input-complete-chip.component.scss'
})
export class InputCompleteChipComponent implements ControlValueAccessor, OnInit{
  inputLabel = input('Labels');
  listName = input('labels');

  private readonly foodPropertyService = inject(FoodPropertyService);
  private readonly destroyRef = inject(DestroyRef);
  value!: string[];
  disabled = false;
  onChange: any = (value: any) => {};
  onTouched: any = () => {};

  availableLabels : string[] = [];
  readonly currentLabel = model('');
  readonly filteredLabels = computed(() => {
    const filteredByLabels = this.availableLabels.filter(label => !this.value?.includes(label));
    const currentLabel = this.currentLabel().toLowerCase();
    return currentLabel
      ? filteredByLabels.filter(label => label.toLowerCase().includes(currentLabel))
      : filteredByLabels.slice();
  });

  ngOnInit(): void {
      const sub = this.foodPropertyService.getList(this.listName()).subscribe(labels => {
        this.availableLabels = labels;
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  
  add(event: MatChipInputEvent): void {
    const valueToAdd = (event.value || '').trim().toLowerCase();

    if (valueToAdd) {
      if(!this.value.includes(valueToAdd)) {
        this.updateValue([...this.value, valueToAdd]);
      }
    }
    this.currentLabel.set('');
  }

  remove(label: string): void {
    const filteredLabels = this.value.filter((l: string) => l !== label);
    this.updateValue(filteredLabels);
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.value) {
      this.updateValue([...this.value, event.option.viewValue]);
    }
    this.currentLabel.set('');
    event.option.deselect();
  }
  
  writeValue(obj: any): void {
    this.value = obj;
    this.onTouched();
  }

  updateValue(value: string[]): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
