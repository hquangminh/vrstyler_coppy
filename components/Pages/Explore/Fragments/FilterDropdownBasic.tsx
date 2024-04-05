import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Dropdown, MenuProps } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import { changeToSlug } from 'common/functions';
import urlPage from 'constants/url.constant';

import { FilterOptionsType, FilterDropdownType, ExploreType } from 'models/explore.model';

const RenderMenu = (menu: FilterOptionsType[], keyFilter: string, exploreType: ExploreType) => {
  const router = useRouter();
  const valueInPath = router.query[keyFilter];

  let items: MenuProps['items'] = [];
  menu.forEach((i) => {
    const onSelect = (value: string) => {
      let query = { ...router.query };
      if (!value || value === 'null' || value === 'relevance') delete query[keyFilter];
      else query[keyFilter] = value;
      delete query.category;

      let pathname =
        exploreType === 'free-models'
          ? urlPage.freeModels
          : exploreType === 'sale-off'
          ? urlPage.saleOff
          : urlPage.explore;
      if (keyFilter === 'category') pathname = pathname.replace('{category}', value || 'all');
      else pathname = pathname.replace('{category}', router.query.category?.toString() || 'all');

      router.push({ pathname, query }, undefined, { shallow: true });
    };

    const active =
      i.key === valueInPath ||
      i.key === valueInPath?.toString().split('--')[1] ||
      ((!valueInPath || valueInPath === 'all') && ['null', 'relevance'].includes(i.key));

    items?.push({
      key: i.key,
      label: i.title,
      className: active ? 'active' : undefined,
      onClick: () =>
        onSelect(
          ['null', 'relevance'].includes(i.key)
            ? ''
            : keyFilter === 'category'
            ? changeToSlug(i.title) + '--' + i.key
            : i.key
        ),
    });
  });
  return items;
};

const ExploreFilterDropdownBasic = (props: FilterDropdownType) => {
  const router = useRouter();

  return (
    <Wrapper id={'filter-dropdown-basic--' + props.keyFilter} className='filter-item'>
      <Dropdown
        menu={{ items: RenderMenu(props.options, props.keyFilter, props.exploreType) }}
        trigger={['click']}
        getPopupContainer={() =>
          document.getElementById('filter-dropdown-basic--' + props.keyFilter) || document.body
        }>
        <div className='filter-item-content'>
          <p className='filter-item-label'>{props.category}</p>
          <div className='filter-dropdown-selected'>
            <p>
              {props.keyFilter === 'category'
                ? props.options.find(
                    (i) => i.key === router.query[props.keyFilter]?.toString().split('--')[1]
                  )?.title || props.options[0].title
                : props.options.find((i) => i.key === router.query[props.keyFilter])?.title ||
                  props.options[0].title}
            </p>
            <CaretDownOutlined />
          </div>
        </div>
      </Dropdown>
    </Wrapper>
  );
};
export default ExploreFilterDropdownBasic;

const Wrapper = styled.div`
  .ant-dropdown-menu li.ant-dropdown-menu-item {
    padding: 5px 10px;
  }
`;
