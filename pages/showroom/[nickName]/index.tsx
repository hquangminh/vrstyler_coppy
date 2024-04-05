import withLayout from 'lib/withLayout';
import withLanguage from 'lib/withLanguage';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import useLanguage from 'hooks/useLanguage';
import commonServices from 'services/common-services';
import showroomServices from 'services/showroom-services';

import HeadSeo from 'components/Fragments/HeadSeo';
import ShowroomDetailComponent from 'components/Pages/Showroom/ShowroomDetail';
import ResultEmpty from 'components/Fragments/ResultEmpty';

import { PageProps } from 'models/page.models';
import { ShowroomDetailType, ShowroomStatisticalType } from 'models/showroom.models';

type Props = PageProps & {
  statistical?: ShowroomStatisticalType;
  showroomSections?: ShowroomDetailType[];
  nickName: string;
};

const Index = (props: Props) => {
  const i18n = useLanguage();

  if (!props.statistical)
    return (
      <>
        <HeadSeo title={i18n.t('not_found') || 'Not found'} descriptions='' image={''} />

        <main>
          <ResultEmpty
            title={i18n.t('showroom_channel_page_404_title')}
            description={i18n
              .t('showroom_channel_page_404_description')
              .replace('{{nickname}}', props.nickName)}
          />
        </main>
      </>
    );

  const name = props.statistical?.market_users[0].name || '';
  const title = props.seo?.title.replace('{{name}}', name);
  const descriptions = props.seo?.descriptions.replace('{{name}}', name);
  const image = props.statistical?.market_users[0].image || '';

  return (
    <>
      <HeadSeo
        title={title ?? ''}
        descriptions={descriptions ?? ''}
        keywords={props.seo?.keywords}
        image={image}
      />

      <ShowroomDetailComponent
        page='view'
        statistical={props.statistical}
        showroomSections={props.showroomSections}
      />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: Props = {
      language: await DetectLanguage(content),
      nickName: content.query.nickName?.toString() ?? '',
    };

    const fetchSeo = commonServices.seoPage('showroom-store', props.language?.langCode);
    const getShowroomStatistical = showroomServices.getShowroomStatistical(props.nickName);
    const fetchShowroomSection = showroomServices.getShowroomNickname(props.nickName);

    await Promise.all([fetchSeo, getShowroomStatistical, fetchShowroomSection])
      .then(([{ data: seo }, { data: statistical }, { data: section }]) => {
        props.seo = seo;
        props.statistical = { ...statistical, nickName: props.nickName };
        props.showroomSections = section.map((item: any) => item.market_showroom_section);
      })
      .catch((error) => console.log(error));

    return { props };
  },
  { skipAuth: true }
);

export default withLanguage(withLayout(Index, { header: { isSearch: false } }));
