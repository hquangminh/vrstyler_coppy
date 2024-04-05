import { CategoryModel } from 'models/category.models';
import useLanguage from 'hooks/useLanguage';

import styled from 'styled-components';
import { ContainerFreeSize } from 'styles/__styles';

const Wrapper = styled.section`
  padding: 40px 0;
  .explore-category-title {
    font-size: 24px;
    font-weight: 300;
    color: var(--text-title);
  }
  .explore-category-description {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 300;
    color: var(--text-title);
  }
`;

type Props = {
  category?: CategoryModel;
  isBestSelling?: boolean;
};
const CategoryExplore = ({ category, isBestSelling }: Props) => {
  const { langLabel } = useLanguage();

  return (
    <Wrapper id='explore-category-banner'>
      <ContainerFreeSize>
        <h1 className='explore-category-title text-truncate'>
          {category?.title ?? langLabel.explore_category_general}
        </h1>
        <div
          className='explore-category-description'
          dangerouslySetInnerHTML={{
            __html:
              category?.description ||
              (isBestSelling
                ? langLabel.explore_best_selling_summary
                : langLabel.explore_category_general_description),
          }}
        />
      </ContainerFreeSize>
    </Wrapper>
  );
};
export default CategoryExplore;
