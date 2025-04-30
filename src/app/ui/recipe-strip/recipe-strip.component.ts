import { Component, inject, input, signal, OnInit } from '@angular/core';
import { FoodService, HomeType } from '../../services/food.service';
import { Recipe } from '../../../models/recipe.model';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-strip',
  standalone: true,
  imports: [RecipeCardComponent],
  templateUrl: './recipe-strip.component.html',
  styleUrl: './recipe-strip.component.scss'
})
export class RecipeStripComponent implements OnInit {
  homeType = input.required<HomeType>();
  recipes = signal<Recipe[]>([]);
  private foodService = inject(FoodService);

  ngOnInit(): void {
    this.foodService.homeRecipes(this.homeType()).subscribe(res => {
      this.recipes.set(res.recipes.data);
    });
  }

}
