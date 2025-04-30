import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { SearchQuery } from '../../models/search-query.model';

export type HomeType = 'random' | 'latest' | 'popular' | 'unpopular';
interface PaginationResult {
  success: boolean;
  recipes: {
    metadata: {
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    data: Recipe[];
  };
}
@Injectable({
  providedIn: 'root',
})
export class FoodService {
  recipeServerUrl = `${environment.serverPath}api`;
  constructor(private user: UserService, private http: HttpClient) {}

  getRecipes(query?: SearchQuery): Observable<PaginationResult> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 10;
    let url = `${this.recipeServerUrl}/recipes?page=${page}&pageSize=${pageSize}`;
    if (query) {
      if(query.name) {
        url += '&name=' + query.name;
      }
      if(query.ingredients) {
        url += '&ingredients=' + query.ingredients.join(',');
      }
      if(query.difficulty) {
        url += '&difficulty=' + query.difficulty;
      }
      if(query.dishType) {
        url += '&dishType=' + query.dishType.join(',');
      }
      if(query.when) {
        url += '&when=' + query.when.join(',');
      }
      if(query.allergens) {
        url += '&allergens=' + query.allergens.join(',');
      }
      if(query.labels) {
        url += '&labels=' + query.labels.join(',');
      }
    }
    return this.http.get<PaginationResult>(url);
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(this.recipeServerUrl + '/recipe?id=' + id);
  }

  scrapeRecipe(url: string): Observable<Recipe> {
    if (!this.user.accessToken) {
      return of();
    }
    return this.http.get<Recipe>(
      this.recipeServerUrl + '/recipe/scrape?url=' + url,
      {
        headers: {
          Authorization: this.user.accessToken,
        },
      }
    );
  }

  addOrUpdateRecipe(recipe: Recipe): Observable<string> {
    if (recipe._id) {
      return this.updateRecipe(recipe);
    } else {
      return this.addRecipe(recipe);
    }
  }

  addRecipe(recipe: Recipe): Observable<string> {
    if (!this.user.accessToken) {
      return of('');
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.user.accessToken,
      }),
    };
    return this.http
      .post<{ id: string }>(
        this.recipeServerUrl + '/recipe',
        { recipe: JSON.stringify(recipe) },
        httpOptions
      )
      .pipe(map((r) => r.id));
  }

  updateRecipe(recipe: Recipe): Observable<string> {
    if (!this.user.accessToken) {
      return of('');
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.user.accessToken,
      }),
    };
    return this.http
      .put<{ id: string }>(
        this.recipeServerUrl + '/recipe',
        { recipe: JSON.stringify(recipe) },
        httpOptions
      )
      .pipe(map((r) => r.id));
  }

  deleteRecipe(id: string): Observable<boolean> {
    if (!this.user.accessToken) {
      return of(false);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.user.accessToken,
      }),
    };
    return this.http
      .delete<{ success: boolean }>(
        this.recipeServerUrl + '/recipe?id=' + id,
        httpOptions
      )
      .pipe(map((res) => res.success));
  }

  // home functions

  homeRecipes(homeType: HomeType = 'random'): Observable<PaginationResult> {
    return this.http.get<PaginationResult>(
      this.recipeServerUrl + '/recipes/' + homeType
    );
  }

}
