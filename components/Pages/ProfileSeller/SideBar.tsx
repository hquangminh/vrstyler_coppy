import { useDispatch } from 'react-redux';

import { message, Tooltip, Typography, UploadFile, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

import { SaveAuthRedux } from 'store/reducer/auth';

import userServices from 'services/user-services';

import useLanguage from 'hooks/useLanguage';

import { useRouter } from 'next/router';
import getBase64 from 'functions/getBase64';
import showNotification from 'common/functions/showNotification';
import { messageError } from 'common/constant';

import AvatarUser from '../User/Fragments/AvatarUser';
import Icon from 'components/Fragments/Icons';

import { AuthModel } from 'models/page.models';
import { UserSellerModel } from 'models/profileSeller';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  auth?: AuthModel;
  profileSeller: UserSellerModel | null;
  listSkills: { id: string; title: string }[];
  listSofts: { id: string; title: string }[];
  rating: number | null;
};

const SideBar = (props: Props) => {
  const { profileSeller, auth, rating, listSkills, listSofts } = props;
  const { langLabel } = useLanguage();
  const router = useRouter();

  const dispatch = useDispatch();
  const onSelectImage: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      try {
        const image: any = await getBase64(info.file.originFileObj);
        const { error, data } = await userServices.changeAvatar({
          oldImage: auth?.user?.image,
          image,
          filename: info.file.name,
          filetype: info.file.type || '',
        });

        if (!error) {
          if (props.auth)
            dispatch(SaveAuthRedux({ ...props.auth, user: { ...props.auth.user, ...data.user } }));
          message.success('Change avatar successfully');
        }
      } catch (error: any) {
        showNotification('error', {
          message: "Can't change avatar",
          description:
            (error?.status ? error?.status + ' - ' : '') +
            (error?.data?.message || messageError.an_unknown_error),
        });
      }
    }
  };

  return (
    <SideBar_wrapper>
      <Sidebar_User>
        <AvatarUser
          avatar={profileSeller?.id === auth?.user?.id ? auth?.user?.image : profileSeller?.image}
          isUpload={profileSeller?.id === auth?.user?.id && !router.pathname.includes('/seller/')}
          onSelect={(info: UploadChangeParam<UploadFile>) => onSelectImage(info)}
        />
        <Tooltip title={profileSeller?.name}>
          <Typography.Paragraph className='user_name mb-0 text-truncate-line'>
            {profileSeller?.name}
          </Typography.Paragraph>
        </Tooltip>

        <p className='work'>{profileSeller?.work}</p>
      </Sidebar_User>
      {<hr />}

      <Sidebar_View>
        <div className='box'>
          <div className='box__icon'>
            <Icon iconName='star-rounded' />
            <p>{langLabel.modeling_order_status_review}</p>
          </div>
          <p className='box__count'>{rating ? `${Math.round(rating * 10) / 10}/5` : '0/5'}</p>
        </div>
        <div className='box'>
          <div className='box__icon'>
            <Icon iconName='seller-eye' className='icon' />
            <p>{langLabel.seller_profile_model_view}</p>
          </div>
          <p className='box__count'>
            {profileSeller?.market_items_aggregate?.aggregate.sum.viewed_count || 0}
          </p>
        </div>
        <div className='box'>
          <div className='box__icon'>
            <Icon iconName='product-like' className='icon' />
            <p>{langLabel.seller_profile_model_like}</p>
          </div>
          <p className='box__count'>
            {profileSeller?.market_items_aggregate?.aggregate.sum.like_count || 0}
          </p>
        </div>
      </Sidebar_View>

      {<hr />}

      <SideBar_Link>
        <h3 className='title'>Website</h3>
        {profileSeller?.website && (
          <a
            href={profileSeller?.website}
            className='title__content'
            target='_blank'
            rel='noreferrer'>
            {profileSeller?.website}
          </a>
        )}
      </SideBar_Link>

      {<hr />}

      <SideBar_Software>
        <h3 className='title'>{langLabel.seller_profile_software}</h3>
        {listSofts.length > 0 && (
          <div className='tag__group title__content'>
            {listSofts.map((soft, index) => (
              <span className='tag' key={index}>
                {soft.title}
              </span>
            ))}
          </div>
        )}
      </SideBar_Software>

      {<hr />}

      <h3 className='title'>{langLabel.seller_profile_skill}</h3>

      {listSkills.length > 0 && (
        <div className='tag__group title__content'>
          {listSkills.map((skill, index) => (
            <span className='tag' key={index}>
              {skill.title}
            </span>
          ))}
        </div>
      )}
    </SideBar_wrapper>
  );
};

const SideBar_wrapper = styled.div`
  hr {
    margin: 20px 0;
    border-color: var(--color-gray-4);
  }

  h3.title {
    font-size: 16px;
    color: #1f1f1f;
    font-weight: 500;
  }

  .title__content {
    margin-top: 10px;
  }

  .tag {
    display: inline-block;
    padding: 7px;
    color: var(--color-gray-9);
    font-size: 14px;
    background-color: var(--color-gray-5);
    border-radius: 5px;
  }

  .tag__group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 10px;
  }

  .work {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Sidebar_User = styled.div`
  padding: 20px 20px 0;
  text-align: center;

  ${maxMedia.medium} {
    padding: 20px;
    background-color: var(--userPage_backgroundColorMain);
  }

  .user_name {
    margin: 14px 0 5px 0;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.88px;
    color: var(--text-title);
  }

  .nickname {
    font-size: 14px;
    color: var(--color-gray-9);
  }

  hr {
    margin: 20px 0;
    border-color: var(--color-line);
  }
`;

const Sidebar_View = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;

    &__icon {
      display: flex;
      gap: 6.7px;
      align-items: center;
      color: var(--color-gray-11);
      .my-icon {
        font-size: 20px;
        color: var(--color-gray-11);
      }
    }

    &__count {
      color: var(--color-gray-9);
      font-size: 14px;
      font-weight: 500;
    }
  }
`;

const SideBar_Link = styled.div`
  a {
    display: block;
    max-width: 100%;
    color: var(--color-gray-9);
    word-break: break-word;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;

    &:hover {
      color: var(--color-primary-700);
    }
  }
`;

const SideBar_Software = styled.div``;

export default SideBar;
