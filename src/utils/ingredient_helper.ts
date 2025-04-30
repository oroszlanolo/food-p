import { Ingredient } from '../models/recipe.model';

/**
 * Returns a multiplier number. multiplying this number with the ingredient quantity results in 1 Kg of the ingredient
 * @param ingredient Ingredient to normalize
 * @returns multiplier
 */
export function ingredientNormalizerMult(ingredient: Ingredient): number {
  const unit = ingredient.unit;
  // @ts-expect-error need to create a type for the gramConvertTable later
  const multiplier = (gramConvertTable[unit] as number | undefined) ?? 1;
  return 1000 / (multiplier * ingredient.quantity);
}

export function normalizeIngredient(ingredient: Ingredient): Ingredient {
  const multiplier = ingredientNormalizerMult(ingredient);
  return {
    name: ingredient.name,
    quantity: ingredient.quantity * multiplier,
    unit: ingredient.unit,
    note: ingredient.note,
  };
}

const gramConvertTable = {
  mg: 0.001,
  g: 1,
  dkg: 10,
  kg: 1000,
  ml: 1,
  cl: 10,
  dl: 100,
  l: 1000,
  'csapott evőkanál': 15,
  'pópozott evőkanál': 20,
  evőkanál: 15,
  ek: 15,
  kávéskanál: 5,
  kk: 5,
  bögre: 200,
  pohár: 200,
  vizespohár: 200,
};
