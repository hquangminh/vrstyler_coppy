import { useRouter } from 'next/router';

import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import isUUID from 'functions/isUUID';
import urlPage from 'constants/url.constant';

import commonServices from 'services/common-services';
import categoryServices from 'services/category-services';

import HeadSeo from 'components/Fragments/HeadSeo';
import ExplorePage from 'components/Pages/Explore';

import { PageProps } from 'models/page.models';
import { CategoryModel } from 'models/category.models';

type Props = PageProps & {
  category?: CategoryModel[];
};

const Index = (props: Props) => {
  const router = useRouter();
  const categoryId: string = router.query.category?.toString().split('--')[1] ?? '';
  const category = props.category?.find((i) => i.id === categoryId);
  const title = 'Sale Off - ' + (category ? category?.title + ' 3D Models' : props.seo?.title);

  return (
    <>
      <HeadSeo
        title={title}
        descriptions={props.seo?.descriptions ?? ''}
        keywords={props.seo?.keywords}
        twitter_card='summary'
      />

      <ExplorePage exploreType='sale-off' />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    const category = content.query.category?.toString() ?? '';
    if (category !== 'all' && !isUUID(category.split('--')[1]))
      return {
        redirect: {
          destination: urlPage.saleOff.replace('{category}', 'all'),
          permanent: false,
        },
      };

    let props: { category?: CategoryModel[] } & PageProps = {
      language: await DetectLanguage(content),
    };

    const fetchAllCategory = categoryServices.getAllCategory();
    const fetchSeo = commonServices.seoPage('sale-off', props.language?.langCode);

    await Promise.allSettled([fetchAllCategory, fetchSeo])
      .then((resp) => {
        if (resp[0].status === 'fulfilled') props.category = resp[0].value.data;
        if (resp[1].status === 'fulfilled') props.seo = resp[1].value.data;
      })
      .catch((error) => console.log(error));

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index, { header: { isSearch: false } }));
