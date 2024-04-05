import { useRouter } from 'next/router';

import styled from 'styled-components';

import { onCheckedFilterCheckList } from 'lib/utils/exploreFunctions';

import ExploreCheckboxCustom from './CheckboxCustom';

import { FilterCheckListType } from 'models/explore.model';

const Wrapper = styled.div`
  .checkbox-list {
    display: flex;
    align-items: center;
    gap: 1rem 2rem;

    .checkbox-item {
      .square {
        width: 2rem;
        height: 2rem;

        .my-icon {
          width: 1.8rem;
        }
      }

      .title {
        font-size: 1.3rem;
        font-weight: 500;
        line-height: 1.23;
        color: var(--text-title);
      }
    }
  }
`;

const ExploreFilterCheckList = (props: FilterCheckListType) => {
  const router = useRouter();

  return (
    <Wrapper className='filter-item'>
      <p className='filter-item-label'>{props.category}</p>

      <div className='checkbox-list'>
        {props.options.map((item, index) => {
          return (
            <ExploreCheckboxCustom
              key={index}
              className='checkbox-item'
              title={item.title}
              active={router.query[item.key] === '1'}
              onChecked={() => onCheckedFilterCheckList(router, item.key, props.exploreType)}
            />
          );
        })}
      </div>
    </Wrapper>
  );
};

export default ExploreFilterCheckList;
