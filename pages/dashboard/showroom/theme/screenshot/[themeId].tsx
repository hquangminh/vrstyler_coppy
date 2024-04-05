import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { DetectLanguage } from 'lib/utils/language';

import config from 'config';
import showroomServices from 'services/showroom-services';

import ShowroomDetailComponent from 'components/Pages/Showroom/ShowroomDetail';

import { PageProps } from 'models/page.models';
import { ShowroomDetailType, ShowroomStatisticalType } from 'models/showroom.models';

type Props = PageProps & {
  statistical: ShowroomStatisticalType;
  showroomSections: ShowroomDetailType[] | null;
};

const Index = (props: Props) => {
  const title = `Theme screen short | ${config.websiteName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <ShowroomDetailComponent
        page='screen-shot'
        statistical={props.statistical}
        isScreenShot
        showroomSections={props.showroomSections ?? undefined}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (content) => {
  const language = await DetectLanguage(content);
  const token = (content.query.token || '').toString();

  let statistical = null;
  let showroomSections = null;

  const themeId: string = content.query.themeId?.toString() || '';
  const nickName: string = content.query.nickName?.toString() || '';

  if (token) {
    const getShowroomStatistical = showroomServices.getShowroomStatistical(nickName);
    const getShowroomPreview = showroomServices.getShowroomPreview(themeId as string, token);

    await Promise.allSettled([getShowroomStatistical, getShowroomPreview])
      .then((resp) => {
        if (resp[0].status === 'fulfilled') {
          statistical = {
            ...resp[0].value.data,
            nickName,
          };
        }
        if (resp[1].status === 'fulfilled') {
          showroomSections = resp[1].value.data?.map(
            (item: { orderid: number; market_showroom_section: ShowroomDetailType[] }) =>
              item.market_showroom_section
          );
        }
      })
      .catch((error) => console.log(error));
  }
  if (!token || !showroomSections) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      language,
      themeId,
      statistical,
      showroomSections,
    },
  };
};

export default Index;
