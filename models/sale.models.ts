import { ProductModel } from './product.model';

export type FlashDeal = {
  id: string;
  start: string;
  end: string;
  products: ProductModel[];
  value: number;
};
