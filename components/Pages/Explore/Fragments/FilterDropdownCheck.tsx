import { useRef, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';

import styled from 'styled-components';
import { Dropdown, MenuProps } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import { useClickOutside } from 'hooks/useClickOutside';
import { getOptionsFilter, onCheckedFilterCheckMulti } from 'lib/utils/exploreFunctions';

import ExploreCheckboxCustom from './CheckboxCustom';

import { FilterOptionsType, FilterDropdownCheckType, ExploreType } from 'models/explore.model';

const RenderMenu = (
  menu: FilterOptionsType[],
  keyFilter: 'formats' | 'licenses',
  exploreType: ExploreType
) => {
  const router: NextRouter = useRouter();

  let items: MenuProps['items'] = [];
  menu.forEach((i) => {
    const active =
      i.key === router.query[keyFilter] ||
      (typeof router.query[keyFilter] === 'object' && router.query[keyFilter]?.includes(i.key));

    items?.push({
      key: i.key,
      label: (
        <ExploreCheckboxCustom
          title={i.title}
          active={active}
          onChecked={() =>
            onCheckedFilterCheckMulti(
              router,
              keyFilter === 'formats' ? 'formats' : 'licenses',
              i.key,
              exploreType
            )
          }
        />
      ),
    });
  });

  return items;
};

const ExploreFilterDropdownCheck = (props: FilterDropdownCheckType) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const onClose = () => setVisible(false);
  useClickOutside(ref, onClose);

  return (
    <Wrapper ref={ref} className='filter-item'>
      <Dropdown
        open={visible}
        menu={{ items: RenderMenu(props.options, props.keyFilter, props.exploreType) }}
        trigger={['click']}
        getPopupContainer={() => ref.current || document.body}>
        <div className='filter-item-content' onClick={() => setVisible(!visible)}>
          <p className='filter-item-label'>{props.category}</p>
          <div className='filter-dropdown-selected'>
            <p>
              {router.query[props.keyFilter] ? getOptionsFilter(router, props.keyFilter) : 'Any'}
            </p>{' '}
            <CaretDownOutlined />
          </div>
        </div>
      </Dropdown>
    </Wrapper>
  );
};

export default ExploreFilterDropdownCheck;

const Wrapper = styled.div`
  .ant-dropdown-menu {
    .ant-dropdown-menu-item {
      &:hover {
        background-color: transparent;
      }
    }
  }
`;
