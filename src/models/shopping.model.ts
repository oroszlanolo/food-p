
export interface ShoppingListNewItem {
    name: string,
    quantity?: number,
    unit?: string,
    note?: string,
    completed: boolean
}
export interface ShoppingListItem extends ShoppingListNewItem {
    _id: string
}

export type ShoppingList = ShoppingListItem[];