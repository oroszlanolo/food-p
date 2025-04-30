import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, merge, Observable, of } from 'rxjs';
import { defaultProperties } from '../../dummy-data/defaultProperties';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FoodPropertyService {
  private readonly http = inject(HttpClient);
  urlPrefix = `${environment.serverPath}api/props/`;

  constructor() {}

  getList(name: string): Observable<string[]> {
    switch (name) {
      case 'units':
        return this.getUnitList();
      case 'labels':
        return this.getLabelList();
      case 'allergens':
        return this.getAllergenList();
      case 'dishTypes':
        return this.getDishTypeList();
      case 'whens':
        return this.getWhenList();
      case 'ingredients':
        return this.getIngredientList();
      default:
        return of([]);
    }
  }

  getUnitList(): Observable<string[]> {
    return merge(
      of(defaultProperties.units),
      this.http.get<string[]>(this.urlPrefix + 'units').pipe(catchError(() => of(defaultProperties.units))),
    );
  }

  getLabelList(): Observable<string[]> {
    return merge(
      of(defaultProperties.labels),
      this.http.get<string[]>(this.urlPrefix + 'labels').pipe(catchError(() => of(defaultProperties.labels))),
    );
  }

  getAllergenList(): Observable<string[]> {
    return merge(
      of(defaultProperties.allergens),
      this.http.get<string[]>(this.urlPrefix + 'allergens').pipe(catchError(() => of(defaultProperties.allergens))),
    );
  }

  getDishTypeList(): Observable<string[]> {
    return merge(
      of(defaultProperties.dishTypes),
      this.http.get<string[]>(this.urlPrefix + 'dishTypes').pipe(catchError(() => of(defaultProperties.dishTypes))),
    );
  }

  getWhenList(): Observable<string[]> {
    return merge(
      of(defaultProperties.whens),
      this.http.get<string[]>(this.urlPrefix + 'whens').pipe(catchError(() => of(defaultProperties.whens))),
    );
  }

  getIngredientList(): Observable<string[]> {
    return merge(
      of(defaultProperties.ingredients),
      this.http.get<string[]>(this.urlPrefix + 'ingredients').pipe(catchError(() => of(defaultProperties.ingredients))),
    );
  }
}
