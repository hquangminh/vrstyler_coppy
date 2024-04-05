import { UserModel } from './user.models';

export type ReviewModel = {
  id: string;
  rate: number;
  content?: string;
  user_id: string;
  market_user: UserModel;
  item_id: string;
  market_reviews?: ReviewModel[];
  createdAt: string;
  updatedAt: string;
};
