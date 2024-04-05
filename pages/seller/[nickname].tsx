import sellerServices from 'services/seller-services';

import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import useLanguage from 'hooks/useLanguage';
import { User3DSoftware, UserSkill } from 'constants/user.constant';
import commonServices from 'services/common-services';

import SideBar from 'components/Pages/ProfileSeller/SideBar';
import ContentComponent from 'components/Pages/ProfileSeller/Content';
import HeadSeo from 'components/Fragments/HeadSeo';
import ResultEmpty from 'components/Fragments/ResultEmpty';

import { UserSellerModel } from 'models/profileSeller';
import { PageProps } from 'models/page.models';

import styled from 'styled-components';
import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';
import Notification from 'pages/notification';

type Props = PageProps & {
  profileSeller: { market_users: UserSellerModel[] | null };
  nickname: string;
};

const Home = (props: Props) => {
  const { profileSeller, auth } = props;
  const i18n = useLanguage();

  // Check is seller
  if (!profileSeller)
    return (
      <>
        <HeadSeo title={i18n.t('not_found')} descriptions='' image='' />
        <main>
          <ResultEmpty
            title={i18n.t('seller_profile_page_404_title')}
            description={i18n
              .t('seller_profile_page_404_description')
              .replace('{{nickname}', props.nickname)}
          />
        </main>
      </>
    );

  const listSofts = User3DSoftware.filter((soft) => {
    if (profileSeller.market_users && profileSeller.market_users?.length > 0) {
      return profileSeller.market_users[0].softwares?.includes(soft.id);
    }
  });

  const listSkills = UserSkill.filter((soft) => {
    if (profileSeller.market_users && profileSeller.market_users?.length > 0) {
      return profileSeller.market_users[0].skills?.includes(soft.id);
    }
  });

  const skillDescriptions =
    listSkills.length > 0 ? listSkills.map((skill) => skill.title).join(' | ') : null;

  const softDescriptions =
    listSofts.length > 0 ? listSofts.map((skill) => skill.title).join(' | ') : null;

  const title = props.seo?.title
    .replace('{{name}}', profileSeller?.market_users ? profileSeller.market_users[0]?.name : '')
    .replace(
      '{{nickname}}',
      profileSeller?.market_users ? profileSeller?.market_users[0].nickname : ''
    );

  const descriptions = props.seo?.descriptions
    .replace('{{name}}', profileSeller?.market_users ? profileSeller.market_users[0]?.name : '')
    .replace(
      '{{skill_software}}',
      (skillDescriptions ? skillDescriptions + (softDescriptions ? ' | ' : '') : '') +
        (softDescriptions ? softDescriptions : '')
    )
    .replace(
      '{{contact}}',
      profileSeller?.market_users && profileSeller.market_users[0]?.website
        ? '| ' + profileSeller.market_users[0]?.website
        : ''
    );

  return (
    <>
      <HeadSeo
        title={title?.trim() ?? ''}
        descriptions={descriptions?.trim() ?? ''}
        image={profileSeller.market_users ? profileSeller.market_users[0].image : ''}
      />

      <ProfileSellerPageWrapper>
        <Container>
          <ProfileSellerPageLayout>
            <ProfileSellerPageContent>
              <SideBar
                profileSeller={profileSeller?.market_users ? profileSeller?.market_users[0] : null}
                listSkills={listSkills}
                listSofts={listSofts}
                rating={
                  profileSeller?.market_users
                    ? profileSeller?.market_users[0].marketReviewsByAuthorId_aggregate.aggregate.avg
                        .rate
                    : null
                }
                auth={auth ?? undefined}
              />
            </ProfileSellerPageContent>

            <ProfileSellerPageContent>
              <ContentComponent
                sellerId={profileSeller?.market_users ? profileSeller?.market_users[0]?.id : ''}
              />
            </ProfileSellerPageContent>
          </ProfileSellerPageLayout>
        </Container>
      </ProfileSellerPageWrapper>
    </>
  );
};

const ProfileSellerPageWrapper = styled.div`
  padding: 30px 0 20px;

  ${maxMedia.medium} {
    padding-bottom: 0;
    padding-top: 0;

    & > div {
      padding: 0;
    }
  }

  .ant-spin {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ProfileSellerPageLayout = styled.div`
  display: grid;
  grid-template-columns: 300px auto;

  gap: 0 20px;

  ${maxMedia.medium} {
    display: block;
  }
`;

const ProfileSellerPageContent = styled.div`
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 90px;
  border-radius: 5px;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);

  ${maxMedia.medium} {
    position: initial;
    box-shadow: none;
  }
`;

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    let props: PageProps = {
      language: await DetectLanguage(content),
    };

    let profileSeller = null;
    const nickname = content.query.nickname?.toString() ?? '';

    const fetchSeo = commonServices.seoPage('seller-profile', props.language?.langCode);
    const fetchGetProfile = sellerServices.getProfile(nickname);

    await Promise.allSettled([fetchGetProfile, fetchSeo])
      .then((resp) => {
        if (resp[0].status === 'fulfilled') profileSeller = resp[0].value.data;
        if (resp[1].status === 'fulfilled') props.seo = resp[1].value.data;
      })
      .catch((error) => console.log(error));
    return { props: { ...props, profileSeller, nickname } };
  },
  { skipAuth: true }
);

export default withLanguage(withLanguage(withLayout(Home)));
