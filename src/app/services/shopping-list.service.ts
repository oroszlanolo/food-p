import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShoppingList, ShoppingListItem, ShoppingListNewItem } from '../../models/shopping.model';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { dummyList } from '../../dummy-data/shoppingList';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  dummyService = new UnauthorizedShoppingListService();
  
  recipeServerUrl = `${environment.serverPath}api`;

  constructor(
    private http: HttpClient,
    private user: UserService) { }

  getList() : Observable<ShoppingList> {
    if(!this.user.accessToken) {
      return this.dummyService.getList();
    }
    return this.http.get<ShoppingList>((this.recipeServerUrl + '/shoppinglist'), {
      headers: {
        'Authorization':  this.user.accessToken
      }
    });
  }
  addItem(item: ShoppingListNewItem) : Observable<ShoppingList> {
    if(!this.user.accessToken) {
      return this.dummyService.addItem(item);
    }
    return this.http.post<ShoppingList>((this.recipeServerUrl + '/shoppinglist/item'), { item: JSON.stringify(item) }, {
      headers: {
        'Authorization':  this.user.accessToken
      }
    });
  }

  addItems(items: ShoppingListNewItem[]) : Observable<ShoppingList> {
    if(!this.user.accessToken) {
      return this.dummyService.addItems(items);
    }
    console.log('lefut');
    return this.http.post<ShoppingList>((this.recipeServerUrl + '/shoppinglist/items'), { items: JSON.stringify(items) }, {
      headers: {
        'Authorization':  this.user.accessToken
      }
    });
  }

  completeItem(id: string) : Observable<boolean> {
    if(!this.user.accessToken) {
      return this.dummyService.completeItem(id);
    }
    return this.http.post<{id: string}>((this.recipeServerUrl + '/shoppinglist/item/complete'), { id: id }, {
      headers: {
        'Authorization':  this.user.accessToken
      }
    }).pipe(map(() => true));
  }

  uncompleteItem(id: string) : Observable<boolean> {
    if(!this.user.accessToken) {
      return this.dummyService.uncompleteItem(id);
    }
    return this.http.post<{id: string}>((this.recipeServerUrl + '/shoppinglist/item/uncomplete'), { id: id }, {
      headers: {
        'Authorization':  this.user.accessToken
      }
    }).pipe(map(() => true));
  }

  clearCompleted() : Observable<boolean> {
    if(!this.user.accessToken) {
      return this.dummyService.clearCompleted();
    }
    return this.http.delete<{id: string}>((this.recipeServerUrl + '/shoppinglist/completeShopping'), {
      headers: {
        'Authorization':  this.user.accessToken
      }
    }).pipe(map(() => true));
  }
}

class UnauthorizedShoppingListService {
  shoppingList = dummyList;
  index = 100;

  getList() : Observable<ShoppingList> {
    return of(this.shoppingList);
  }

  addItem(item: ShoppingListNewItem) : Observable<ShoppingList> {
    this.shoppingList.push({
      _id: this.index.toString(),
      ...item
    })
    this.index++;
    return of(this.shoppingList);
  }

  addItems(items: ShoppingListNewItem[]) : Observable<ShoppingList> {
    const newItems : ShoppingListItem[] = items.map(item => {
      this.index++
      return {
        _id: this.index.toString(),
        ...item
      }
    })
    this.shoppingList.push(...newItems);
    return of(this.shoppingList);
  }
  completeItem(id: string) : Observable<boolean> {
    return this.toggleItem(id, true);
  }

  uncompleteItem(id: string) : Observable<boolean> {
    return this.toggleItem(id, false);
  }
  toggleItem(id: string, complete = true) : Observable<boolean> {
    const item = this.shoppingList.find(i => i._id === id);
    if(item) {
      item.completed = complete;
    }
    return of(true);
  }

  clearCompleted() : Observable<boolean> {
    this.shoppingList = this.shoppingList.filter(i => !i.completed);
    return of(true);
  }
}