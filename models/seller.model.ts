import { ProductModel } from './product.model';
import { UserModel } from './user.models';

export type TypeFilter =
  | 'name'
  | 'price'
  | 'date'
  | 'status'
  | 'publish_date'
  | 'order_status'
  | 'rate'
  | 'item_id'
  | 'is_replied'
  | 'sort';

export type BodyOrder = {
  order_status: boolean;
  start_date: Date;
  end_date: Date;
};

type MarketItemsBoughtAggregate = {
  aggregate: { count: number; sum: { price: number; total_earn: number } };
  nodes: (ProductModel & { is_checked?: boolean })[];
};

export type TotalAmountType = {
  available: number | null;
  holding: number | null;
  request: number | null;
  total: number | null;
  withdraw: number | null;
  total_amount_day: {
    aggregate: {
      sum: {
        total_earn: number | null;
      };
    };
  };
  total_amount_month: {
    aggregate: {
      sum: {
        total_earn: number | null;
      };
    };
  };
  total_current_amount: number;
  total_revenue: {
    aggregate: {
      sum: {
        price: number | null;
      };
    };
  };
  total_withdraw: {
    aggregate: {
      sum: {
        price: number | null;
      };
    };
  };
};

export type ParamFilter = {
  name?: string;
  start_date: string | Date;
  end_date: string | Date;
  order_status?: boolean;
  status?: number;
  sort_by?: string;
  sort_type?: 'desc' | 'asc';
};

export type SellerOrder = {
  market_order: {
    id: string;
    order_no: string;
    discount: number;
    paygate: string;
    payment_method: string;
    market_coupon?: { code: string; prefix: string; value: number };
    market_items_boughts_aggregate: MarketItemsBoughtAggregate;
    market_user: Pick<UserModel, 'nickname' | 'name' | 'image'>;
    createdAt: string;
  };
  market_items_boughts: ProductModel[];
  subtotal: number;
  fee: number;
  total_earn: number;
};

export type SellerOrderItem = Omit<SellerOrder, 'market_items_boughts'> & {
  market_items_boughts_aggregate: MarketItemsBoughtAggregate;
};

export type WithdrawModel = {
  account_name: string;
  amount: number;
  card_number: string;
  createAt: string | Date;
  id: string;
  market_user: {
    email: string;
    name: string;
    nickname: string;
  };
  order_no: number;
  status: 1 | 2 | 3;
  swift_code: string;
  user_id: string;
};

export type ParamWithdraw = {
  account_name: string;
  swift_code: string;
  bank_name: string;
  card_number: string;
  amount: number;
  amount_withdraw?: number;
};

export type MarketUserType = {
  id: string;
  image: string;
  name: string;
  nickname: string;
};

export type MarketReviewsType = {
  content: string;
  createAt?: string | Date;
  id?: string;
  is_replied?: boolean;
  item_id?: string;
  parentid?: string;
  market_user?: MarketUserType;
  updateAt?: string | Date;
  user_id?: string;
};

export type ReviewModel = {
  content: string | undefined;
  createdAt: string | Date;
  id: string;
  is_replied: boolean;
  market_item: ProductModel;
  market_user: MarketUserType;
  market_reviews: MarketReviewsType[] | [];
  rate: number;
};

export type ParamReview = {
  start_date?: string | Date;
  end_date?: string | Date;
  sort_type?: 'desc' | 'asc' | '';
  sort_by?: string;
  rate?: number;
  title?: string;
  is_replied: boolean;
};

export type StatisticalModel = {
  time: number | string;
  value: number;
};
