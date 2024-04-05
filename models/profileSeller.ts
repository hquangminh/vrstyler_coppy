import { UserModel } from './user.models';

export type ProfileSellerModel = {
  title: string;
  preview: boolean;
  image: string;
};

export type UserSellerModel = UserModel & {
  market_items_aggregate: { aggregate: { sum: { like_count: number; viewed_count: number } } };
  market_reviews_aggregate: { aggregate: { avg: { rate: number } } };
  marketReviewsByAuthorId_aggregate: { aggregate: { avg: { rate: number | null } } };
};
