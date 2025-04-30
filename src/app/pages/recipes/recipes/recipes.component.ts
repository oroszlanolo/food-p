import { ViewportScroller } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { environment } from '../../../../environments/environment';
import { Recipe } from '../../../../models/recipe.model';
import { SearchQuery } from '../../../../models/search-query.model';
import { FoodService } from '../../../services/food.service';
import { RecipeCardComponent } from '../../../ui/recipe-card/recipe-card.component';
import { RecipeSearchComponent } from '../recipe-search/recipe-search.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: true,
  imports: [RecipeSearchComponent, RecipeCardComponent, MatPaginatorModule],
})
export class RecipesComponent implements OnInit {
  recipeServerUrl = environment.serverPath;
  query: SearchQuery = {};
  pageSize = signal(9);
  recipes = signal<Recipe[]>([]);
  page = signal(1);
  totalCount = signal(0);
  totalPages = signal(0);
  loading = signal(false);
  hasPrev = computed(() => this.page() > 1);
  hasNext = computed(() => this.page() < this.totalPages());

  constructor(
    private foodService: FoodService,
    private scroller: ViewportScroller,
  ) {}

  ngOnInit(): void {
    this.updateRecipes();
  }
  onSearch(query: SearchQuery) {
    this.query = query;
    this.page.set(1);
    this.updateRecipes();
  }
  setPage(idx: number) {
    idx = idx + 1; // server indexes from 1, paginator indexes from 0
    if (idx > 0 && idx <= this.totalPages() && !this.loading()) {
      this.page.set(idx);
      this.updateRecipes();
      this.scroller.scrollToPosition([0, 0]);
    }
  }

  private updateRecipes() {
    this.loading.set(true);
    this.query.page = this.page();
    this.query.pageSize = this.pageSize();
    console.log(this.query);
    this.foodService.getRecipes(this.query).subscribe((res) => {
      this.loading.set(false);
      this.recipes.set(res.recipes.data);
      this.totalCount.set(res.recipes.metadata.totalCount);
      this.totalPages.set(res.recipes.metadata.totalPages);
    });
  }
}
