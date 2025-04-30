import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dishType',
  standalone: true,
})
export class DishTypePipe implements PipeTransform {
  transform(tp: string): string {
    switch (tp) {
      case 'cold_appetizer':
        return 'Cold Appetizer';
      case 'warm_appetizer':
        return 'Warm Appetizer';
      case 'amuse_bouche':
        return 'Amuse Bouche';
      case 'dessert':
        return 'Dessert';
      case 'garnish':
        return 'Garnish';
      case 'main_dish':
        return 'Main Dish';
      case 'soup':
        return 'Soup';
      case 'drink':
        return 'Drink';
      case 'other_course':
        return 'Other';
      default:
        return 'Other';
    }
  }
}
