import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Recipe } from '../../../models/recipe.model';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [TitleCasePipe, RouterLink, MatCardModule, MatChipsModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
  host: {
    '[attr.display]': 'block' 
  }
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();
  recipeServerUrl = environment.serverPath;
}
