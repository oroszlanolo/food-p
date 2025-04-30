import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShoppingList, ShoppingListItem, ShoppingListNewItem } from '../../../models/shopping.model';
import { ShoppingListService } from '../../services/shopping-list.service';
import { InputCompleteComponent } from '../../ui/input/input-complete/input-complete.component';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    InputCompleteComponent,
  ],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
})
export class ShoppingListComponent implements OnInit {
  Object = Object;
  shoppingList: ShoppingList = [];
  completedList: ShoppingList = [];
  error: string | null = null;
  loading = false;
  constructor(private shoppingService: ShoppingListService) {}

  ngOnInit(): void {
    this.shoppingService.getList().subscribe((shopList) => this.updateShoppingList(shopList));
  }

  onAddItem(addItemForm: NgForm) {
    console.log(addItemForm);
    const value = addItemForm.form.value;
    if (value?.name != undefined && value?.name != null && value?.name != '') {
      this.loading = true;
      const item: ShoppingListNewItem = {
        name: value.name,
        completed: false,
      };
      if (value?.quantity) {
        item.quantity = value.quantity;
      }
      if (value?.unit) {
        item.unit = value.unit;
        item.quantity = value.quantity || 1;
      }
      this.shoppingService.addItem(item).subscribe({
        next: (shopList) => {
          this.updateShoppingList(shopList);
          addItemForm.reset();
          this.error = null;
        },
        error: () => {
          this.error = 'An error has occured';
        },
        complete: () => (this.loading = false),
      });
    }
  }

  private updateShoppingList(unsortedList: ShoppingList) {
    this.shoppingList = unsortedList.filter((i) => !i.completed);
    this.completedList = unsortedList.filter((i) => i.completed);
  }

  completeItem(item: ShoppingListItem) {
    this.shoppingList = this.shoppingList.filter((i) => i._id != item._id);
    this.completedList.push(item);
    this.shoppingService.completeItem(item._id).subscribe();
  }

  uncompleteItem(item: ShoppingListItem) {
    this.completedList = this.completedList.filter((i) => i._id != item._id);
    this.shoppingList.push(item);
    this.shoppingService.uncompleteItem(item._id).subscribe();
  }
  clearCompleted() {
    this.completedList = [];
    this.shoppingService.clearCompleted().subscribe();
  }

  share() {
    let shareText = '';
    this.shoppingList.forEach((item) => {
      let itemText = '';
      if (item.quantity) {
        itemText += item.quantity;
        itemText += ' ';
      }
      if (item.unit) {
        itemText += item.unit;
        itemText += ' ';
      }
      itemText += item.name;
      itemText += '\n';
      shareText += itemText;
    });
    navigator.share({
      text: shareText,
    });
  }
}
