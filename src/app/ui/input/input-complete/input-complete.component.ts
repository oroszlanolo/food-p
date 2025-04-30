/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DestroyRef, forwardRef, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FoodPropertyService } from '../../../services/food-property.service';

@Component({
  selector: 'app-input-complete',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatAutocompleteModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCompleteComponent),
      multi: true,
    },
  ],
  templateUrl: './input-complete.component.html',
  styleUrl: './input-complete.component.scss',
})
export class InputCompleteComponent implements OnInit {
  inputLabel = input('Labels');
  listName = input('labels');

  private readonly foodPropertyService = inject(FoodPropertyService);
  private readonly destroyRef = inject(DestroyRef);
  value = signal<string>('');
  disabled = false;
  onChange: any = (value: any) => {};
  onTouched: any = () => {};

  valueOptions: string[] = [];
  filteredValueOptions = signal<string[]>(this.valueOptions);

  valueChanged($event: Event) {
    this.filteredValueOptions.set(
      this.valueOptions.filter((u) =>
        u.toLowerCase().includes(($event.target as HTMLInputElement).value.toLowerCase()),
      ),
    );

    this.onChange(this.value());
  }

  ngOnInit(): void {
    const sub = this.foodPropertyService.getList(this.listName()).subscribe((values) => {
      this.valueOptions = values;
      this.filteredValueOptions.set(values);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  writeValue(obj: any): void {
    this.value.set(obj);
    this.onTouched();
  }

  updateValue(value: string): void {
    this.value.set(value);
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
