import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import config from 'config';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import { DetectLanguage } from 'lib/utils/language';

import convertHTMLEntity from 'common/functions/convertHTMLEntity';

import helpCenterServices from 'services/helpCenter-services';

import HeaderSample from 'components/Layout/HeaderSample';
import FooterSample from 'components/Layout/FooterSample';
import HelpCenterArticleComponent from 'components/Pages/HelpCenterDetail';

import { PageProps } from 'models/page.models';
import { HelpModel } from 'models/help.models';

type HelpCategory = {
  title: string;
  id: string;
};

type Props = PageProps & {
  data: HelpModel;
};

const Index = (props: Props) => {
  const router = useRouter();

  const image = props.data?.image ? props.data.image : config.urlRoot + '/static/thumbnail.jpg';

  const articleId = router.query.articleId?.toString().split('--')[1] ?? '';
  const categoryId = router.query.helpCollection?.toString().split('--')[1] ?? '';

  const [helpCategory, setHelpCategory] = useState<HelpCategory[]>();

  const fetchCollections = useCallback(async () => {
    await helpCenterServices
      .getCollectionsRelated(articleId, categoryId, 5)
      .then((res) => setHelpCategory(res.data));
  }, [articleId, categoryId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const title = `${props.data?.title} - Help Center | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name='description' content={convertHTMLEntity(props.data?.content)} />

        {/* Facebook Open Graph */}
        <meta property='og:title' content={props.data?.title} />
        <meta property='og:description' content={convertHTMLEntity(props.data?.content)} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={config.urlRoot + router.asPath} />
        <meta property='og:image' content={image} />

        {/* Twitter */}
        <meta property='twitter:card' content='VRStyler_HelpCenter' />
        <meta property='twitter:site' content={config.urlRoot + router.asPath} />
        <meta property='twitter:title' content={props.data?.title} />
        <meta property='twitter:description' content={convertHTMLEntity(props.data?.content)} />
        <meta property='twitter:image' content={image} />

        <link rel='image_src' href={image} />
        <link rel='canonical' href={config.urlRoot + router.asPath} />
      </Head>

      <HeaderSample style={{ padding: '18px 0' }} />

      <HelpCenterArticleComponent data={props.data} helpCategory={helpCategory ?? []} />

      <FooterSample help={true} blog={false} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (content) => {
  let props: { data?: HelpModel } & PageProps = {};

  props.language = await DetectLanguage(content);

  const articleId = content.query.articleId?.toString().split('--')[1] ?? '';
  await helpCenterServices
    .getDetail(articleId, { headers: { Authorization: '' } })
    .then((res) => (props.data = res.data))
    .catch((err) => console.error(err));

  if (!props.data) return { notFound: true };

  return { props };
};

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
