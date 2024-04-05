import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import useDebounce from 'hooks/useDebounce';
import isUUID from 'functions/isUUID';
import commonServices from 'services/common-services';
import showroomServices from 'services/showroom-services';

import ShowroomDetailComponent from 'components/Pages/Showroom/ShowroomDetail';
import HeadSeo from 'components/Fragments/HeadSeo';

import { PageProps } from 'models/page.models';
import { ShowroomStatisticalType } from 'models/showroom.models';

type Props = PageProps & {
  statistical: ShowroomStatisticalType;
};

const Index = (props: Props) => {
  const router = useRouter();

  const nickName: string = props.statistical?.market_users[0].name || '';

  const title = nickName ? nickName + ' 3D Models - Showroom' : '';
  const descriptions = 'View and Buy 3D models by ' + nickName;

  const [keywords, setKeywords] = useState<string>(router.query.s?.toString() ?? '');

  const debouncedKeywords = useDebounce<string>(keywords, 500);

  const onChangeSearch = useCallback(() => {
    let query = { ...router.query };
    delete query['category'];
    delete query['nickName'];
    let categoryFilter: string = router.query.category?.toString() ?? 'all';

    if (debouncedKeywords?.trim()) {
      query.s = debouncedKeywords.trim();
    } else delete query['s'];

    const pathname =
      '/' + router.asPath.split('?')[0].split('/').slice(1, -1).join('/') + '/' + categoryFilter;

    router.push({ pathname, query }, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeywords]);

  useEffect(() => {
    onChangeSearch();
  }, [onChangeSearch]);

  useEffect(() => {
    setKeywords(router.query.s?.toString() ?? '');
  }, [router.query.s]);

  return (
    <>
      <HeadSeo title={title} descriptions={descriptions} keywords={props.seo?.keywords} />

      <ShowroomDetailComponent
        page='products'
        valueSearch={keywords}
        onChangeSearch={(value) => setKeywords(value as string)}
        statistical={props.statistical}
      />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const category = content.query.category?.toString() ?? '';
    if (category !== 'all' && !isUUID(category.split('--')[1]))
      return {
        redirect: {
          destination: content.resolvedUrl.split('/').slice(0, -1).join('/') + '/all',
          permanent: false,
        },
      };

    let props: PageProps = { language: await DetectLanguage(content) };

    let statistical = null;
    let showroomStatistical = null;
    const nickName = content.query.nickName?.toString() ?? '';

    const getShowroomStatistical = showroomServices.getShowroomStatistical(nickName);

    const seoPage = commonServices.seoPage('showroom', props.language?.langCode);

    await Promise.allSettled([seoPage, getShowroomStatistical])
      .then((resp) => {
        if (resp[0].status === 'fulfilled') props.seo = resp[0].value?.data;
        if (resp[1].status === 'fulfilled') statistical = { ...resp[1].value.data, nickName };
      })
      .catch((error) => console.log(error));

    return { props: { ...props, showroomStatistical, statistical } };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index, { header: { isSearch: false } }));
