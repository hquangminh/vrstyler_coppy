import { CountAggregate } from 'models';

export type HelpModel = {
  id: string;
  title: string;
  image: string;
  content: string;
  market_category_help: HelpCategory;
  createdAt: string;
};

export type HelpCategory = {
  id: string;
  title: string;
  orderid: number;
  description: string;
  icon?: string;
  status: boolean;
  market_helps_aggregate?: CountAggregate;
};
