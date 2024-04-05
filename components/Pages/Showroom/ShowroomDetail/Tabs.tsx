import { useRouter } from 'next/router';

import useLanguage from 'hooks/useLanguage';

import InputSearch from '../Fragments/InputSearch';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = {
  nickName?: string;
  page?: 'view' | 'products' | 'screen-shot';
  valueSearch?: string;
  onSearch?: (value?: string) => void;
  onChangeSearch?: (value?: string) => void;
};

const TabsComponent = (props: Props) => {
  const router = useRouter();
  const { langCode, langLabel } = useLanguage();

  return (
    <TabsComponent_wrapper>
      <div className='tabs'>
        <div
          className={`btn ${props.page === 'view' || props.page === 'screen-shot' ? 'active' : ''}`}
          onClick={() => props.page !== 'view' && router.push('/showroom' + '/' + props.nickName)}>
          {langLabel.view[0]?.toUpperCase() + langLabel.view.slice(1) || 'View'}
        </div>
        <div
          className={`btn ${props.page === 'products' ? 'active' : ''}`}
          onClick={() =>
            props.page !== 'products' &&
            router.push(`/${langCode}/showroom/${router.query.nickName}/products/all`)
          }>
          {langLabel.showroom_channel_all_product}
        </div>
      </div>
      <InputSearch
        className='custom__search'
        onSearch={props.onSearch}
        value={props.valueSearch}
        onChange={props.onChangeSearch ? props.onChangeSearch : undefined}
        placeholder={langLabel.showroom_channel_search_placeholder}
      />
    </TabsComponent_wrapper>
  );
};

const TabsComponent_wrapper = styled.div`
  border-bottom: 1px solid var(--color-gray-4);
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${maxMedia.medium} {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .ant-input-affix-wrapper {
    padding: 0 11px;
    border-radius: 10px;
    background-color: #f6f7f8;
  }
  .ant-input {
    box-sizing: border-box;
    background-color: #f6f7f8;
    height: 40px;
  }
  .custom__search {
    min-width: 320px;
    ${maxMedia.medium} {
      min-width: 100%;
      margin-bottom: 15px;
    }
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;

    .btn {
      min-width: 120px;
      position: relative;
      height: 100%;
      font-size: 16px;
      line-height: 22px;
      color: var(--color-gray-6);
      font-weight: 400;
      transition: 0.1s;
      padding: 20px 15px;
      white-space: nowrap;

      &::before {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: transparent;
        transition: 0.1s;
      }

      &.active::before {
        background-color: var(--color-primary-700);
      }

      &.active,
      &:hover {
        color: var(--color-primary-700);
      }
    }
  }

  ${maxMedia.medium} {
    margin: 0 -20px;
    padding: 0 20px;
    gap: 16px;
  }
`;

export default TabsComponent;
