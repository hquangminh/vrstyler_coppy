import { UserModel } from './user.models';

export type CommentModel = {
  id: string;
  content: string;
  like_count: number;
  dislike_count: number;
  item_id: string;
  parentid?: string;
  children?: CommentModel[];
  totalCommentChild: number;
  market_user: UserModel;
  market_likes_comments?: { type: 'like' | 'dislike' }[];
  user_replied?: { [key: string]: string };
  createdAt: string;
};
