import { useEffect } from 'react';

import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import commonServices from 'services/common-services';

import HeadSeo from 'components/Fragments/HeadSeo';

import { PageProps } from 'models/page.models';

type Props = PageProps & {};

const Index = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/showroom/${router.query.nickName}/products/all`);
  }, [router]);

  return (
    <HeadSeo
      title={props.seo?.title ?? 'Showroom'}
      descriptions={props.seo?.descriptions ?? ''}
      keywords={''}
      image={''}
    />
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = { language: await DetectLanguage(content) };

    await commonServices
      .seoPage('showroom', props.language?.langCode)
      .then((res) => (props.seo = res.data));

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index));
