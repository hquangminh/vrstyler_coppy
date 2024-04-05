import { useSelector } from 'react-redux';

import useLanguage from 'hooks/useLanguage';
import { AppState } from 'store/type';

import DashboardTab from 'components/Layout/Dashboard/Tab';
import CardVipComponent from 'components/Pages/Dashboard/Showroom/Card/CardVip';
import BannerComponent from 'components/Pages/Dashboard/Showroom/Card/Banner';
import ProductComponent from './ProductShowroom';

import { ShowroomCardWrapper } from './style';

export default function DashboardShowroomCard() {
  const i18n = useLanguage();
  const Auth = useSelector((state: AppState) => state.auth);

  return (
    <ShowroomCardWrapper>
      <DashboardTab
        tabItems={[
          {
            key: 'product_showroom',
            label: i18n.t('dashboard_card_product_name', 'Product'),
            children: <ProductComponent />,
          },
          {
            key: 'card_vip',
            label: i18n.t('dashboard_card_vip_name', 'Product'),
            children: Auth && <CardVipComponent auth={Auth} />,
            disabled: !Auth?.user?.market_showroom?.is_vip,
          },
          {
            key: 'banner',
            label: i18n.t('dashboard_card_banner_name', 'Banner'),
            children: Auth && <BannerComponent auth={Auth} />,
          },
        ].filter((i) => !i.disabled)}
      />
    </ShowroomCardWrapper>
  );
}
