import { CreateSessionBody } from 'services/checkout-services';
import { AuthModel } from './page.models';
import { ProductModel } from './product.model';

export type CheckoutProps = {
  auth?: AuthModel;
  bodyCreateOrder: CreateSessionBody;
  discountValue: number;
  subToTal: number;
};

export type ProductCartModel = {
  id: string;
  market_item: Pick<ProductModel, 'id' | 'title' | 'image' | 'price' | 'old_price'> & {
    is_available?: boolean;
  };
  isProductChange?: boolean;
};

export type CouponModel = {
  id: string;
  prefix: string;
  code: string;
  type: 'percent' | 'price';
  value: number;
  min_order?: number;
  max_discount?: number;
  discount: number;
};
