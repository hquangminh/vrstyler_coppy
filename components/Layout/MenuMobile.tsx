import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import styled from 'styled-components';
import { RightOutlined } from '@ant-design/icons';
import { ConfigProvider, Drawer, Menu } from 'antd';
import { MenuProps } from 'antd/lib';
import { ItemType } from 'antd/es/menu/hooks/useItems';

import useLanguage from 'hooks/useLanguage';
import useDetectMobile from 'hooks/useDetectMobile';

import { changeToSlug } from 'common/functions';
import scrollToElementById from 'functions/scrollToElementById';
import urlPage from 'constants/url.constant';
import categoryServices from 'services/category-services';

import { AppState } from 'store/type';
import { SaveCategory } from 'store/reducer/web';
import { CloseMenuMobile } from 'store/reducer/modal';

import SocialInBanner from 'components/Fragments/SocicalBanner';

const MenuWrapper = styled.div`
  .ant-menu {
    font-weight: 500;
  }
  .modeling-service-menu-item.active {
    color: var(--vrs-modeling-service-primary);
  }
`;
const SocialWrapper = styled.ul`
  padding: 12px;
  text-align: center;
  .banner_social {
    position: unset;
    transform: unset;
    display: inline-flex;
    gap: 20px;

    &::before,
    &:after {
      display: none;
    }
  }

  li + li {
    margin-top: 0;
  }

  li {
    height: 40px;
    width: 40px;
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: inherit;

      border-radius: 50%;
      background-color: var(--color-gray-4);

      .my-icon,
      .anticon {
        height: 16px;
        width: auto;
      }
    }
  }
`;

const MenuMobile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const i18n = useLanguage();
  const visible = useSelector((state: AppState) => state.modal.menuMobile);
  const categories = useSelector((state: AppState) => state.web.categories);
  const isMobile = useDetectMobile();

  const [menuActive, setMenuActive] = useState<string[]>();

  const isModelingPage = router.pathname === urlPage.modeling_homepage;

  // Get Category
  useEffect(() => {
    const fetchCategory = async () => {
      await categoryServices.getAllCategory().then((res) => dispatch(SaveCategory(res.data)));
    };
    !categories && fetchCategory();
  }, [categories, dispatch]);

  useEffect(() => {
    dispatch(CloseMenuMobile());
  }, [isMobile, dispatch]);

  useEffect(() => {
    if (visible) document.body.style.overflowY = 'hidden';
    else document.body.style.removeProperty('overflow-y');
  }, [visible]);

  useEffect(() => {
    const getMenuActive = () => {
      if (router.pathname === urlPage.showroom) {
        return ['showroom'];
      } else if (router.pathname === '/free-models/[category]') {
        return ['model-free'];
      } else if (router.pathname === '/explore/[category]') {
        if (router.query.category === 'all') {
          return ['explore-all'];
        } else {
          const categoryID = router.query.category?.toString().split('--')[1];
          if (categoryID) return [categoryID];
        }
      } else {
        const mainPage = document.getElementsByTagName('main')[0];
        const classActive = mainPage?.getAttribute('id');
        if (classActive) return [classActive];
      }
    };
    setMenuActive(getMenuActive());
  }, [router.pathname, router.query.category]);

  const onChangePage = (page: string = '') => {
    if (page !== router.asPath) router.push({ pathname: page });
    dispatch(CloseMenuMobile());
  };

  const onScrollToSection = (id: string) => {
    const header = document.getElementsByTagName('header')[0];
    scrollToElementById({ id, behavior: 'smooth', deduct: header.clientHeight });
    dispatch(CloseMenuMobile());
  };

  const categoryMenu: ItemType[] | undefined = categories?.map(({ id, title }) => {
    const link = urlPage.explore.replace('{category}', changeToSlug(title) + '--' + id);
    return { key: id, label: title, onClick: () => onChangePage(link) };
  });
  const exploreSubMenu = [
    { key: 'explore-all', label: i18n.t('all'), onClick: () => onChangePage('/explore/all') },
    ...(categoryMenu ?? []),
  ];

  const menuMain: MenuProps['items'] = [
    {
      key: 'explore',
      label: i18n.t('header_menu_explore'),
      children: exploreSubMenu,
    },
    {
      key: 'model-free',
      label: i18n.t('footer_free_model'),
      onClick: () => onChangePage('/free-models/all'),
    },
    {
      key: 'modeling',
      label: i18n.t('header_menu_modeling_service'),
      onClick: () => onChangePage('/modeling'),
    },
    {
      key: 'showroom',
      label: i18n.t('header_menu_showroom'),
      onClick: () => onChangePage('/showroom'),
    },
  ];

  const menuModeling: MenuProps['items'] = [
    {
      key: 'home',
      label: i18n.t('header_modeling_home'),
      onClick: () => onScrollToSection('home'),
    },
    {
      key: 'customer',
      label: i18n.t('header_modeling_customer'),
      onClick: () => onScrollToSection('customer'),
    },
    {
      key: 'step',
      label: i18n.t('header_modeling_order'),
      onClick: () => onScrollToSection('step'),
    },
    {
      key: 'product',
      label: i18n.t('header_modeling_product'),
      onClick: () => onScrollToSection('product'),
    },
    {
      key: 'pricing',
      label: i18n.t('header_modeling_pricing'),
      onClick: () => onScrollToSection('pricing'),
    },
    {
      key: 'faq',
      label: i18n.t('header_modeling_faq'),
      onClick: () => onScrollToSection('faq'),
    },
    {
      key: 'contact',
      label: i18n.t('contact'),
      onClick: () => {
        router.push(urlPage.contact_us);
      },
    },
  ];

  return (
    <Drawer
      placement='left'
      closable={false}
      width={320}
      styles={{ body: { padding: 0 } }}
      open={visible}
      onClose={() => dispatch(CloseMenuMobile())}>
      <MenuWrapper>
        <ConfigProvider
          theme={{
            token: { marginXXS: 0, fontSize: 16 },
            components: {
              Menu: {
                itemBorderRadius: 0,
                itemHeight: 36,
                itemSelectedBg: 'transparent',
              },
            },
          }}>
          <Menu
            mode='inline'
            items={isModelingPage ? menuModeling : menuMain}
            selectable={false}
            inlineIndent={16}
            expandIcon={({ isOpen }) => (
              <RightOutlined rotate={isOpen ? 90 : 0} style={{ color: '#bfbfbf' }} />
            )}
            defaultOpenKeys={router.pathname === '/explore/[category]' ? ['explore'] : undefined}
            selectedKeys={menuActive}
            style={{ marginBlock: 12 }}
          />
        </ConfigProvider>
        {!isModelingPage && (
          <SocialWrapper>
            <SocialInBanner size='large' color='#4d4d4d' />
          </SocialWrapper>
        )}
      </MenuWrapper>
    </Drawer>
  );
};

export default MenuMobile;
