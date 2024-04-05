import { useRouter } from 'next/router';

import styled from 'styled-components';

import { changeToSlug } from 'common/functions';
import urlPage from 'constants/url.constant';

import { FilterCategoryMobileType } from 'models/explore.model';

import { maxMedia } from 'styles/__media';

const Wrapper = styled.div`
  padding: 2rem 20px;

  .item {
    width: fit-content;
    font-size: 1.6rem;
    line-height: 1.38;
    color: var(--secondary);

    cursor: pointer;

    &:hover {
      color: rgba(var(--color-primary-rgb-700), 60%);
    }

    & + .item {
      margin-top: 1.5rem;
    }

    &.active {
      color: var(--color-primary-700);
    }

    ${maxMedia.small} {
      font-size: 14px;
    }
  }
`;

const ExploreMobileFilterBasic = (props: FilterCategoryMobileType) => {
  const router = useRouter();

  const onSelect = (value: string) => {
    let query = { ...router.query };
    if (!value || value === 'null' || value === 'relevance') delete query[props.category];
    else query[props.category] = value;
    delete query.category;

    let pathname =
      props.exploreType === 'free-models'
        ? urlPage.freeModels
        : props.exploreType === 'sale-off'
        ? urlPage.saleOff
        : urlPage.explore;
    if (props.category === 'category') pathname = pathname.replace('{category}', value || 'all');
    else pathname = pathname.replace('{category}', router.query.category?.toString() || 'all');

    router.push({ pathname, query }, undefined, { shallow: true });
    props.onClose();
  };

  return (
    <Wrapper>
      {props.options.map((item, index) => {
        const valueInPath = router.query[props.category];
        const active =
          item.key === valueInPath ||
          item.key === valueInPath?.toString().split('--')[1] ||
          ((!valueInPath || valueInPath === 'all') && ['null', 'relevance'].includes(item.key));

        return (
          <div
            key={index}
            className={'item' + (active ? ' active' : '')}
            onClick={() =>
              onSelect(
                ['null', 'relevance'].includes(item.key)
                  ? ''
                  : props.category === 'category'
                  ? changeToSlug(item.title) + '--' + item.key
                  : item.key
              )
            }>
            {item.title}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default ExploreMobileFilterBasic;
