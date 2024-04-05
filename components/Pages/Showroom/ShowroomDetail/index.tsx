import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Breadcrumb, Flex, Result, Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import showroomServices from 'services/showroom-services';

import ExplorePage from 'components/Pages/Explore';
import BannerComponent from './Banner';
import TabsComponent from './Tabs';
import ViewComponent from './View';
import ScreenShot from './ScreenShot';

import { UserModel } from 'models/user.models';
import {
  ShowroomStatisticalType,
  ShowroomDetailType,
  ShowroomPage,
  ShowroomDecorationSection,
} from 'models/showroom.models';

import { Container } from 'styles/__styles';
import * as L from './style';

type Props = {
  me?: UserModel;
  page: ShowroomPage;
  onlyRead?: boolean;
  isScreenShot?: boolean;
  valueSearch?: string;
  statistical?: ShowroomStatisticalType;
  showroomSections?: ShowroomDetailType[];
  onChangeSearch?: (value?: string) => void;
};

const ShowroomDetailComponent = (props: Props) => {
  const router = useRouter();
  const { t } = useLanguage();

  const [loadingData, setLoadingData] = useState(!(props.statistical && props.showroomSections));
  const [statistical, setStatistical] = useState<ShowroomStatisticalType | undefined>(
    props.statistical
  );
  const [sections, setSections] = useState<ShowroomDetailType[] | undefined>(
    props.showroomSections
  );

  const nickname =
    statistical?.nickName ?? router.query.nickName?.toString() ?? props.me?.nickname ?? '';
  const name = statistical?.market_users[0].name;

  const fetchData = useCallback(() => {
    if (props.page === 'view' && !sections) {
      setLoadingData(true);
      const fetchStatistical = !statistical
        ? showroomServices.getShowroomStatistical(nickname)
        : undefined;
      const fetchTheme = router.query.themeId
        ? showroomServices.getShowroomPreview(router.query.themeId.toString())
        : showroomServices.getShowroomNickname(nickname);

      Promise.all([fetchStatistical, fetchTheme])
        .then(([statistical, { data: theme }]) => {
          if (statistical) setStatistical({ ...statistical.data, nickName: nickname });
          if (theme)
            setSections(
              theme.map((item: ShowroomDecorationSection) => item.market_showroom_section)
            );
        })
        .catch(() => message.destroy())
        .finally(() => setLoadingData(false));
    } else setLoadingData(false);
  }, [nickname, props.page, router.query.themeId, sections, statistical]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSearch = (value?: string) => {
    router.push(`/showroom/${nickname}/products/all?s=${value}`);
  };

  if (loadingData)
    return (
      <Flex align='center' justify='center' style={{ height: '100vh' }}>
        <Spin />
      </Flex>
    );
  else if (!statistical && !sections)
    return (
      <Result
        status='404'
        title='Oops!'
        subTitle={t('dashboard_theme_not_found_title')}
        style={{ paddingBlock: 100 }}
      />
    );

  return (
    <L.ShowroomDetailComponent_wrapper
      className={`${props.onlyRead ? 'is__preview' : ''}`}
      id={props.page}>
      <Container>
        <Breadcrumb
          className='custom__breadcrumb'
          separator='>'
          items={[
            { title: <Link href='/'>{t('header_modeling_home')}</Link> },
            { title: <Link href='/showroom'>{t('header_menu_showroom')}</Link> },
            { title: name, breadcrumbName: 'view' },
            {
              title: <Link href={`/showroom/${nickname}`}>{name}</Link>,
              breadcrumbName: 'products',
            },
            { title: t('product'), breadcrumbName: 'products' },
          ].filter((i) => !i.breadcrumbName || i.breadcrumbName === props.page)}
        />
      </Container>

      <Container
        size={props.isScreenShot ? 'free' : 'default'}
        className={props.isScreenShot ? 'p-0' : ''}>
        <BannerComponent
          statistical={statistical}
          bannerImg={statistical?.market_users[0]?.market_showroom?.banner ?? ''}
          isScreenShot={props.isScreenShot}
        />

        <TabsComponent
          onSearch={props.page === 'view' ? onSearch : undefined}
          nickName={props.onlyRead ? statistical?.nickName : nickname}
          valueSearch={props.valueSearch}
          onChangeSearch={props.onChangeSearch ?? undefined}
          page={props.page}
        />

        <L.ViewComponent_wrapper
          isPreview={props.onlyRead}
          className={`${props.isScreenShot ? 'pb-0' : ''} ${
            props.page === 'products' ? 'p-0' : ''
          }`}>
          {props.page === 'view' && (
            <div style={{ paddingBlock: loadingData ? 100 : 0 }}>
              <Spin spinning={loadingData}>
                <ViewComponent data={sections} />
              </Spin>
            </div>
          )}

          {props.isScreenShot && <ScreenShot data={sections} />}
        </L.ViewComponent_wrapper>

        {props.page === 'products' && (
          <L.AllProductsComponent_wrapper>
            <ExplorePage exploreType='showroom' statistical={statistical} />
          </L.AllProductsComponent_wrapper>
        )}
      </Container>
    </L.ShowroomDetailComponent_wrapper>
  );
};

export default ShowroomDetailComponent;
