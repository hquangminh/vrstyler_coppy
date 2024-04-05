import { OrderModel } from './order.model';
import { ProductModel } from './product.model';
import { UserModel } from './user.models';

export enum NotificationType {
  REVIEW = 1,
  COMMENT = 2,
  ORDER = 3,
}

export enum NotificationContentType {
  COMMENT = 1,
  MENTION = 2,
  REVIEW = 3,
  REVIEW_REPLY = 4,
  ORDER = 5,
}

export type NotificationModel = {
  id: string;
  review_id?: string;
  is_read: boolean;
  content: string;
  content_type: NotificationContentType;
  type: NotificationType;
  createdAt: string;
  market_item: ProductModel;
  market_user_sender: UserModel;
  market_order: Pick<OrderModel, 'id' | 'order_no'>;
};
