import { useDispatch, useSelector } from 'react-redux';

import { Modal, ModalProps } from 'antd';

import { AppState } from 'store/type';
import { CloseSellerRegister } from 'store/reducer/modal';

import SalesRegistrationForm from './FormRegister';
import SalesRegistrationSuccess from './RegisterSuccess';

import { UserType } from 'models/user.models';

import styled from 'styled-components';

const SalesRegistration = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state: AppState) => state.modal.sellerRegister);
  const user = useSelector((state: AppState) => state.auth?.user);

  const modalProps: ModalProps = {
    open: visible,
    width: 900,
    footer: null,
    destroyOnClose: true,
    onCancel: () => dispatch(CloseSellerRegister()),
  };

  return (
    <Wrapper {...modalProps}>
      {user?.type === UserType.CUSTOMER && <SalesRegistrationForm />}
      {user?.type === UserType.SELLER && <SalesRegistrationSuccess />}
    </Wrapper>
  );
};
export default SalesRegistration;

const Wrapper = styled(Modal)`
  .ant-modal-content {
    border-radius: 11px;
  }
  .ant-modal-body {
    padding: 30px;
  }
`;
