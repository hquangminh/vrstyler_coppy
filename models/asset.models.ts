import { LicenseModel } from './license.models';
import { ProductModel } from './product.model';
import { ReviewModel } from './review.models';
import { UserModel } from './user.models';

export type AssetModel = Pick<
  ProductModel,
  'id' | 'title' | 'image' | 'price' | 'file_details' | 'market_user'
> & {
  downloaded: boolean;
  item_id: string;
  license: LicenseModel;
  market_item: { market_reviews?: ReviewModel[] };
  marketUserByAuthorId: Pick<UserModel, 'name' | 'nickname'>;
};
