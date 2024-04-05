import { ProductModel } from './product.model';

export type OrderStatusType = 1 | 2 | 3 | 4 | 5 | 6;
export type OrderProductType = Pick<ProductModel, 'id' | 'title' | 'image' | 'price' | 'old_price'>;

export type OrderModel = {
  id: string;
  order_no: string;
  status: OrderStatusType;
  items: OrderProductType[];
  subtotal: number;
  discount: number;
  amount: number;
  payment_note?: string;
  market_coupon?: {
    prefix: string;
    code: string;
    type: 'price' | 'percent';
    value: number;
  };
  payment_method: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
};
