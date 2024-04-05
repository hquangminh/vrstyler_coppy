import { Dispatch, SetStateAction, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Divider, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { UpdateNotification } from 'store/reducer/web';
import { SelectAuthInfo } from 'store/reducer/auth';
import { changeToSlug } from 'common/functions';
import notificationServices from 'services/notification-services';
import urlPage from 'constants/url.constant';

import Icon from 'components/Fragments/Icons';
import Moment from 'components/Fragments/Moment';
import MyImage from 'components/Fragments/Image';
import { TypeContentNotification } from './TypeContentNoti';

import {
  NotificationContentType,
  NotificationModel,
  NotificationType,
} from 'models/notification.models';
import { UserType } from 'models/user.models';

import { maxMedia } from 'styles/__media';

type Props = {
  dataRender: NotificationModel;
  showFilter?: boolean;
  setNotification: Dispatch<SetStateAction<{ notifications: NotificationModel[]; total: number }>>;
  onDeleteNotification: (value: NotificationModel) => void;
  onClosePopup?: () => void;
};

const NotificationCart = (props: Props) => {
  const { dataRender, setNotification, onDeleteNotification, onClosePopup } = props;
  const { langCode, langLabel } = useLanguage();
  const user = useSelector(SelectAuthInfo);

  const dispatch = useDispatch();

  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const getMarkRead = async (id: string) => {
    try {
      cardRef.current?.classList.remove('visible');
      const { error } = await notificationServices.markRead(id);
      if (!error) {
        setNotification((current) => ({
          ...current,
          notifications: current.notifications?.map((item) => ({
            ...item,
            is_read: item.id === id ? true : item.is_read,
          })),
        }));
        dispatch(UpdateNotification({ type: 'down' }));
      }
    } catch (error) {}
  };

  const handelGoToNotification = () => {
    if (dataRender?.is_read === false) getMarkRead(dataRender?.id);
    if (onClosePopup) onClosePopup();
    if (dataRender?.type === NotificationType.ORDER) {
      router.push(urlPage.dashboard_order_detail.replace('{orderID}', dataRender.market_order.id));
    } else if (
      dataRender.content_type === NotificationContentType.REVIEW &&
      dataRender.review_id &&
      user?.type !== UserType.CUSTOMER
    ) {
      router.push({ pathname: urlPage.dashboard_review, query: { view: dataRender.review_id } });
    } else {
      const pathname = urlPage.productDetail.replace(
        '{slug}',
        changeToSlug(dataRender?.market_item?.title) + '--' + dataRender?.market_item?.id
      );
      const query = {
        scroll_area: dataRender.type === 2 ? 'comment' : 'review',
        notification_id: dataRender.id,
      };
      router.push({ pathname, query }, undefined, {
        shallow: router.query.notification_id === dataRender.id,
        scroll: false,
      });
    }
  };

  return (
    <Wrapper ref={cardRef} onClick={handelGoToNotification}>
      <div className='Notification_Left'>
        <div className='Notification_Icon'>
          {dataRender?.type === 2 && <Icon style={{ color: '#3fc1d1' }} iconName='noti-comment' />}
          {dataRender?.type === 1 && <Icon style={{ color: '#ffc043' }} iconName='noti-star' />}
          {dataRender?.type === 3 && <Icon style={{ color: '#369CA5' }} iconName='noti-order' />}
        </div>
        <div className='Noti_Card_Info'>
          <MyImage
            className='img-avatar'
            src={dataRender.market_user_sender?.image}
            img_error='/static/images/avatar-default.png'
            alt=''
            width={40}
            height={40}
          />

          <div className='Noti_Info_Card'>
            <p
              className='Noti_Info_Title'
              dangerouslySetInnerHTML={{
                __html: TypeContentNotification(langLabel)
                  [dataRender.content_type]?.replace(
                    '{{user}}',
                    `<span class='Noti_Info_Name '>${dataRender?.market_user_sender?.name}</span>`
                  )
                  .replace(
                    '{{product}}',
                    `<span class='Noti_Info_Address'>${dataRender?.market_item?.title}</span>`
                  )
                  .replace(
                    '{{id}}',
                    `<span class='Noti_Info_Address'>#${dataRender?.market_order?.order_no}</span>`
                  ),
              }}
            />

            <div className='Noti__Time'>
              <p>
                <Moment date={dataRender?.createdAt} langCode={langCode} fromNow />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='Notification_Right'>
        {props.showFilter && (
          <div className='Notification_Filter'>
            <Dropdown
              overlayClassName='notification-dropdown-action'
              trigger={['click']}
              className='Filer_Comment_Right'
              overlayStyle={{
                position: 'fixed',
                zIndex: 1,
              }}
              placement='bottomRight'
              autoAdjustOverflow={false}
              arrow={{ pointAtCenter: true }}
              getPopupContainer={(elm) => elm || document.body}
              onOpenChange={(visible) =>
                cardRef.current?.classList[visible ? 'add' : 'remove']('visible')
              }
              menu={{
                items: [
                  {
                    key: 'read',
                    label: langLabel.notification_mark_read,
                    disabled: dataRender.is_read,
                    onClick: (e: any) => {
                      e.domEvent.stopPropagation();
                      getMarkRead(dataRender.id);
                    },
                  },
                  { key: 'divider', label: <Divider />, disabled: dataRender.is_read },
                  {
                    key: 'delete',
                    label: langLabel.notification_delete_item,
                    onClick: (e: any) => {
                      e.domEvent.stopPropagation();
                      onDeleteNotification(dataRender);
                    },
                  },
                ].filter((i) => !i.disabled),
              }}>
              <div className='icon-filter-dropdown' onClick={(e) => e.stopPropagation()}>
                <EllipsisOutlined className='icon__filter' />
              </div>
            </Dropdown>
          </div>
        )}

        <div className={'Noti_Sight_Read' + (dataRender.is_read === true ? ' hidden' : '')} />
      </div>
    </Wrapper>
  );
};
export default NotificationCart;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 12px 18px 14px;
  ${maxMedia.medium} {
    padding: 12px 16px 12px 18px;
  }
  cursor: pointer;

  &:hover,
  &.visible {
    background-color: var(--color-gray-3);
    .icon-filter-dropdown {
      opacity: 1;
      visibility: visible;
    }
  }

  .Notification_Left {
    display: flex;
    flex-wrap: nowrap;
    .Notification_Icon {
      display: inline-block;
    }
    span.anticon {
      font-size: 24px;
    }
    .img-avatar {
      margin-right: 5px;
      margin-left: 7px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .Noti_Card_Info {
      display: flex;
      flex-wrap: nowrap;
    }
    .Noti_Info_Card {
      font-size: 14px;
      font-weight: 600;
      line-height: 19px;
      color: #424153;
      .Noti_Info_Title {
        font-size: 14px;
        font-weight: 400;
        color: #424153;
        .Noti_Info_Name,
        .Noti_Info_Address {
          word-break: break-word;
          font-weight: 500;
          color: #424153;
          font-weight: bold;
        }
      }
      .Noti__Time {
        font-size: 12px;
        color: #7f7f8d;
        margin-top: 4px;
      }
    }
  }
  .Notification_Right {
    display: flex;
    align-items: center;
    gap: 10px;
    .Notification_Filter {
      cursor: pointer;
      .icon__filter {
        display: initial;
        width: 24px;
        height: 14px;
      }
      ${maxMedia.medium} {
        margin-right: -5px;
      }
    }
    .Noti_Sight_Read {
      background: #cf293f;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      &.hidden {
        background: transparent;
      }
      ${maxMedia.small} {
        margin-left: 8px;
      }
    }
  }

  .icon-filter-dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: transparent;

    opacity: 0;
    visibility: hidden;

    &:hover,
    &:has(.ant-dropdown:not(.ant-dropdown-hidden)) {
      background-color: var(--color-gray-5);
    }
  }

  .ant-table-thead {
    display: none;
  }
`;
