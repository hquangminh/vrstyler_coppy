import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Modal, ModalProps } from 'antd';

import config from 'config';
import { CloseShare, detectShareVisible, selectInfoShare } from 'store/reducer/web';

import Icon from './Icons';

import styled from 'styled-components';
import useLanguage from 'hooks/useLanguage';

const ShareWithSocial__ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    border: none;
    border-radius: 6px;
    overflow: hidden;
    .my-icon {
      font-size: 40px;
    }
  }
`;

const ShareWithSocial = () => {
  const dispatch = useDispatch();

  const visible = useSelector(detectShareVisible);
  const infoShare = useSelector(selectInfoShare);

  const { langLabel } = useLanguage();

  useEffect(() => {
    if (visible) document.body.style.cssText = 'overflow:hidden; touch-action:none;';
    else document.body.removeAttribute('style');
  }, [visible]);

  const handelShare = (type: 'facebook' | 'twitter' | 'pinterest') => {
    switch (type) {
      case 'facebook':
        window.open(
          'https://www.facebook.com/dialog/share?' +
            `app_id=${config.facebookAppId}` +
            `&href=${infoShare?.link}`
        );
        break;

      case 'twitter':
        window.open('http://www.twitter.com/share?url=' + infoShare?.link);
        break;

      case 'pinterest':
        window.open('http://pinterest.com/pin/create/link/?' + `url=${infoShare?.link}`);
        break;

      default:
        break;
    }
  };

  const ModalProps: ModalProps = {
    title: langLabel.share,
    open: visible,
    width: 480,
    footer: null,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    onCancel: () => dispatch(CloseShare()),
  };

  return (
    <Modal {...ModalProps}>
      <ShareWithSocial__ButtonGroup>
        <button onClick={() => handelShare('facebook')}>
          <Icon iconName='facebook-button' />
        </button>
        <button onClick={() => handelShare('twitter')}>
          <Icon iconName='twitter-button' />
        </button>
        <button onClick={() => handelShare('pinterest')}>
          <Icon iconName='pinterest-button' />
        </button>
      </ShareWithSocial__ButtonGroup>
    </Modal>
  );
};
export default ShareWithSocial;
