import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Checkbox } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { AppState } from 'store/type';
import { UpdateUser } from 'store/reducer/auth';
import userServices from 'services/user-services';

import { UserType } from 'models/user.models';

import styled from 'styled-components';

const SalesRegistrationForm = () => {
  const { langLabel, t } = useLanguage();

  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth?.user);

  const [agree, setAgree] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async () => {
    if (!agree) {
      setError(t('register_sale_required_agree_conditions_terms_msg'));
      return;
    }
    try {
      const { error } = await userServices.sellerRegister();
      if (!error && user) dispatch(UpdateUser({ ...user, type: UserType.SELLER }));
    } catch (error: any) {
      console.log('Submit Failed', error);
    }
  };

  return (
    <Wrapper>
      <h2 className='sales-registration-title'>
        {langLabel.become_seller_title || 'Become a seller on Vrstyler'}
      </h2>
      <div className='sales-registration-content'>
        <p>
          {langLabel.become_seller_caption_first ||
            'Quality work and fair pricing are critical to the success of our sellers and the VRStyler Store as a whole.'}
        </p>
        <p>
          {langLabel.become_seller_caption_second ||
            '  In order to become a seller, we will review your portfolio to see if it meets the following criteria:'}
        </p>
        <ul>
          <li>
            {langLabel.become_seller_list_first ||
              'Make sure your Vrstyler portfolio is representative of your work.'}
          </li>
          <li>
            {langLabel.become_seller_list_second ||
              'All models, textures, and/or animations must be your original property.'}
          </li>
          <li>
            {langLabel.become_seller_list_thirty ||
              'Work is modeled to an acceptable industry standard in keeping with other sellers in the store.'}
          </li>
          <li>
            {langLabel.become_seller_list_fifty ||
              'Thumbnails, titles, and descriptions accurately reflect the items for sale.'}
          </li>
          <li>
            {langLabel.become_seller_list_sixty ||
              'Models are accurately UV mapped when UVs are used.'}
          </li>
          <li>
            {langLabel.become_seller_list_eighty ||
              'Textures (when used) and materials are optimized and efficient.'}
          </li>
        </ul>
      </div>
      <div className='sales-registration-agree'>
        <Checkbox
          onChange={(e) => {
            setError('');
            setAgree(e.target.checked);
          }}>
          {langLabel.become_seller_check_first || 'Please checking'}{' '}
          <a
            href='https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/seller-privacy--ae48dae0-f860-4d53-8fae-8a3ffd89dc2d'
            target='_blank'
            rel='noreferrer'>
            {langLabel.become_seller_check_second || 'conditions and terms to become a seller'}
          </a>{' '}
          {langLabel.become_seller_check_last || 'on VRStyler store'}
        </Checkbox>
        {error && <p className='msg-err'>{error}</p>}
      </div>
      <div className='sales-registration-submit'>
        <Button type='primary' onClick={onSubmit}>
          {langLabel.btn_register || 'Register'}
        </Button>
      </div>
    </Wrapper>
  );
};
export default SalesRegistrationForm;

const Wrapper = styled.div`
  .sales-registration-title {
    font-size: 24px;
    font-weight: 500;
    color: var(--text-title);
  }
  .sales-registration-content {
    margin-top: 20px;
    font-size: 14px;
    color: var(--text-caption);

    p {
      margin-bottom: 20px;
    }
    ul {
      margin-bottom: 20px;
      padding-left: 22px;
      list-style: disc;
    }
  }
  .sales-registration-agree {
    margin-top: 20px;

    a {
      color: #1890ff;
      text-decoration: underline;
    }
    .msg-err {
      margin-left: 24px;
      font-size: 12px;
      color: var(--color-red-5);
      font-style: italic;
    }
  }
  .sales-registration-submit {
    margin-top: 20px;
    text-align: center;
    .ant-btn {
      width: 154px;
      height: 41px;
    }
  }

  .help__link {
    color: var(--text-caption);
  }
`;
