import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FoodService } from '../../../services/food.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-recipe',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.scss'
})
export class NewRecipeComponent {
  url = '';
  error? : string;
  loading = false;

  get importDisabled() {
    return this.loading || !this.loggedIn || this.url.length === 0;
  }
  
  get loggedIn() {
    return this.userService.loggedIn;
  }
  constructor(private router: Router, private userService: UserService, private foodService: FoodService) {}


  importUrl() {
    this.error = undefined;
    this.loading = true;
    this.foodService.scrapeRecipe(this.url).subscribe({
      next: recipe => {
        this.loading = false;
        this.router.navigate(['/edit'], {state: {recipe: recipe, url: this.url}});
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Unexpected error happened';
      }
    });
  }
  
  goToEdit() {
    this.router.navigate(['/edit']);
  }

}
