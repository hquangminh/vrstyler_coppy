import ProductCard from 'components/Fragments/ProductCard';

import { ProductModel } from 'models/product.model';
import { ExploreType } from 'models/explore.model';

import * as SC from './style';

type Props = {
  isReverse?: boolean;
  products?: ProductModel[];
  exploreType?: ExploreType;
};

const ExploreResult = (props: Props) => {
  return (
    <SC.Wrapper className='ProductList__Grid'>
      {props.products?.map((product) => {
        return <ProductCard key={product.id} data={product} exploreType={props.exploreType} />;
      })}
    </SC.Wrapper>
  );
};

export default ExploreResult;
