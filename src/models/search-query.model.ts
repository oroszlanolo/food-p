import { Allergen, Difficulty, DishType, When } from "./recipe.model";

export interface QueryBase {
    page?: number,
    pageSize?: number
}

export interface SearchQuery extends QueryBase {
    name?: string,
    ingredients?: string[],
    difficulty?: Difficulty,
    dishType?: DishType[],
    when?: When[],
    allergens?: Allergen[],
    labels?: string[]
}