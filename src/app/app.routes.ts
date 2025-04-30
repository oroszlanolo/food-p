import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from './pages/recipes/recipes/recipes.component';
import { RecipeViewComponent } from './pages/recipes/recipe-view/recipe-view.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NewRecipeComponent } from './pages/recipes/new-recipe/new-recipe.component';
import { EditRecipeComponent } from './pages/recipes/edit-recipe/edit-recipe.component';
import { ShoppingListComponent } from './pages/shopping-list/shopping-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: "home", component: HomeComponent },
    { path: "recipes", component: RecipesComponent },
    { path: "recipe/:id", component: RecipeViewComponent },
    { path: "add-new", component: NewRecipeComponent },
    { path: "edit", component: EditRecipeComponent },
    // { path: "edit/:id", component: EditRecipeComponent },
    { path: "shopping-list", component: ShoppingListComponent },
    { path: "**", component: PageNotFoundComponent },
];
