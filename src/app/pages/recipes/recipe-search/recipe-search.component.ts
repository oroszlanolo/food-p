import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, EventEmitter, inject, Output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Allergen, Difficulty, DishType, When } from '../../../../models/recipe.model';
import { SearchQuery } from '../../../../models/search-query.model';
import { FoodPropertyService } from '../../../services/food-property.service';
import { InputCompleteChipComponent } from '../../../ui/input/input-complete-chip/input-complete-chip.component';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    AsyncPipe,
    TitleCasePipe,
    InputCompleteChipComponent,
    MatBadgeModule,
  ],
})
export class RecipeSearchComponent {
  @Output() searchHappened = new EventEmitter<SearchQuery>();

  foodPropertyService = inject(FoodPropertyService);

  expansionPanel = viewChild.required(MatExpansionPanel);

  availableDishTypes = this.foodPropertyService.getDishTypeList();
  availableWhens = this.foodPropertyService.getWhenList();
  availableAllergens = this.foodPropertyService.getAllergenList();

  searchString = signal('');
  difficulty = signal('');
  dishType = signal<string[]>([]);
  when = signal<string[]>([]);
  allergens = signal<string[]>([]);
  labels = signal<string[]>([]);
  ingredients = signal<string[]>([]);

  additionalFilterCount = computed(() => {
    let count = 0;
    if (this.ingredients().length > 0) count++;
    if (this.difficulty()) count++;
    if (this.dishType().length > 0) count++;
    if (this.when().length > 0) count++;
    if (this.allergens().length > 0) count++;
    if (this.labels().length > 0) count++;
    return count;
  });

  doSearch(event: Event) {
    this.expansionPanel().close();
    const query: SearchQuery = {};
    if (this.ingredients().length > 0) {
      query.ingredients = this.ingredients().map((i) => i.trim());
    } else {
      if (this.searchString()) {
        query.name = this.searchString().trim();
      }
    }
    if (this.difficulty()) {
      query.difficulty = this.difficulty() as Difficulty;
    }
    if (this.dishType().length > 0) {
      query.dishType = this.dishType() as DishType[];
    }
    if (this.when().length > 0) {
      query.when = this.when() as When[];
    }
    if (this.allergens().length > 0) {
      query.allergens = this.allergens() as Allergen[];
    }
    if (this.labels().length > 0) {
      query.labels = this.labels().map((l) => l.trim());
    }
    this.searchHappened.emit(query);
    this.stopPropagation(event);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
