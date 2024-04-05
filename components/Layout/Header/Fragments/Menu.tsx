import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';
import { useRouter } from 'next/router';

import styled, { css } from 'styled-components';
import { Col, Dropdown, Row } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { changeToSlug } from 'common/functions';
import categoryServices from 'services/category-services';

import { AppState } from 'store/type';
import { SaveCategory } from 'store/reducer/web';

import MyImage from 'components/Fragments/Image';

import { CategoryModel } from 'models/category.models';

import { maxMedia } from 'styles/__media';

const Wrapper = styled.nav`
  display: flex;
  align-items: center;

  height: 100%;

  & > ul {
    display: flex;
    align-items: center;
    gap: 24px;

    margin-bottom: 0;

    list-style: none;

    ${maxMedia.custom(1200)} {
      gap: 20px;
    }
  }

  .ant-dropdown.reset-style {
    border-top: 16px solid transparent;
    & > .ant-dropdown-menu {
      padding: 0;
      background-color: transparent;
      & > .ant-dropdown-menu-item {
        padding: 0;
        background-color: transparent;
        cursor: auto;
      }
    }
  }
`;
const MenuItem = styled.li<{ $isHome?: boolean; $active?: boolean }>`
  ${({ $isHome, $active }) => {
    if ($isHome)
      return css`
        color: #ffffff;
        .anticon {
          color: #ffffff;
        }
      `;
    else if ($active)
      return css`
        color: var(--color-primary-700);
        .anticon {
          color: var(--color-primary-700);
        }
      `;
    else
      return css`
        color: var(--text-title);
        .anticon {
          color: var(--text-title);
        }
      `;
  }}
  cursor: pointer;

  a,
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    width: max-content;
    font-size: 1.4rem;
    line-height: 1.57;
    color: inherit;
    transition: unset;

    cursor: pointer;
  }

  &:hover {
    color: ${({ $isHome }) => ($isHome ? 'var(--color-primary-100)' : 'var(--color-primary-700)')};

    .anticon {
      color: ${({ $isHome }) =>
        $isHome ? 'var(--color-primary-100)' : 'var(--color-primary-700)'};
    }
  }

  &.modeling-service-menu-item {
    &:hover {
      color: rgba(var(--vrs-modeling-service-primary-rgb), 70%);
    }
    &.active {
      color: var(--vrs-modeling-service-primary);
    }
  }
`;
const MenuDropdownWrapper = styled.div`
  width: 600px;
  max-width: 800px;

  background-color: var(--color-white);
  border-radius: 1rem;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  overflow: hidden;

  ul {
    height: 100%;
    list-style: none;
  }
  .menu_dropdown__other {
    padding: 3.6rem 1.6rem;
    background-color: var(--color-main-6);

    li + li {
      margin-top: 1.3rem;
    }

    a {
      font-size: 1.4rem;
      line-height: 1.57;
      color: var(--color-main-2);
      transition: color 0.2s linear;

      &:hover {
        color: var(--color-gray-1);
      }
    }
  }
  .menu_dropdown__main {
    padding: 20px;
    border-left: var(--border-1px);

    li {
      & + li {
        margin-top: 8px;
      }
      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--secondary);
        font-size: 1.4rem;
        line-height: 1;
        color: var(--gray-2);
        transition: color 0.2s linear;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
          color: var(--color-primary-700);
        }

        img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          margin-right: 5px;
        }
      }
    }
  }
`;

const menus = (langLabel: Record<string, string>) => [
  {
    key: 'marketplace',
    title: langLabel.header_menu_explore,
    url: '/explore/all',
  },
  {
    key: 'sale-off',
    title: langLabel.header_menu_sale_off,
    url: '/sale-off/all',
  },
  {
    key: 'showroom',
    title: langLabel.header_menu_showroom,
    url: '/showroom',
  },
];

type Props = { isHome: boolean };

const HeaderMenu = ({ isHome }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { langCode, langLabel } = useLanguage();

  const categories = useSelector((state: AppState) => state.web.categories);

  // Get Category
  useEffect(() => {
    const fetchCategory = async () => {
      await categoryServices.getAllCategory().then((res) => dispatch(SaveCategory(res.data)));
    };
    !categories && fetchCategory();
  }, [categories, dispatch]);

  return (
    <Wrapper>
      <ul>
        {menus(langLabel).map((item) => {
          const isStartsWith = (match: string) =>
            router.asPath.startsWith(match) && item.url.startsWith(match);

          const condition_1 = router.asPath === item.url,
            condition_2 =
              isStartsWith('/explore') &&
              !router.asPath.includes('sort=best-selling') &&
              !item.url?.includes('sort=best-selling'),
            condition_3 =
              router.asPath.startsWith('/explore') &&
              item.url?.startsWith('/explore/all?sort=best-selling') &&
              router.asPath.includes('sort=best-selling'),
            condition_4 = isStartsWith('/sale-off');

          const active = condition_1 || condition_2 || condition_3 || condition_4;

          return item.key === 'marketplace' ? (
            <Dropdown
              overlayClassName='reset-style'
              key={item.key}
              dropdownRender={() =>
                categories && categories.length > 0 ? (
                  <MenuDropdown categories={categories} />
                ) : null
              }
              getPopupContainer={(triggerNode) => triggerNode}>
              <MenuItem key={item.key} $isHome={isHome} $active={active}>
                <span>
                  <Link
                    style={active ? { pointerEvents: 'none' } : {}}
                    href={'/' + langCode + item.url}>
                    {item.title}
                  </Link>
                  {categories && categories.length > 0 && <CaretDownOutlined />}
                </span>
              </MenuItem>
            </Dropdown>
          ) : (
            <MenuItem key={item.key} $isHome={isHome} $active={active}>
              {item.url ? (
                <Link
                  style={active ? { pointerEvents: 'none' } : {}}
                  href={'/' + langCode + item.url}>
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </MenuItem>
          );
        })}
      </ul>
    </Wrapper>
  );
};

export default HeaderMenu;

// Menu dropdown of Explore
const MenuDropdown = (props: { categories: CategoryModel[] }) => {
  const leftCount = Math.ceil(props.categories.length / 2);
  const categoryLeft = props.categories
    .filter((category) => category.status === true)
    .slice(0, leftCount);
  const categoryRight = props.categories
    .filter((category) => category.status === true)
    .slice(leftCount);

  return (
    <MenuDropdownWrapper>
      <Row>
        <Col span={12}>
          <ul className='menu_dropdown__main'>
            {categoryLeft.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={`/explore/${changeToSlug(item.title)}--${item.id}`}>
                    <MyImage src={item.icon} width={26} height={26} alt='' loading='lazy' />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Col>
        <Col span={12}>
          <ul className='menu_dropdown__main'>
            {categoryRight.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={`/explore/${changeToSlug(item.title)}--${item.id}`}>
                    <MyImage src={item.icon} width={26} height={26} alt='' loading='lazy' />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Col>
      </Row>
    </MenuDropdownWrapper>
  );
};
