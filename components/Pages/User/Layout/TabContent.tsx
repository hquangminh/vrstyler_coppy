import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { Input } from 'antd';

import useDebounce from 'hooks/useDebounce';
import useRouterChange from 'hooks/useRouterChange';

import Icon from 'components/Fragments/Icons';

import { maxMedia } from 'styles/__media';

type Props = {
  tabs: { title: string; active: boolean; url: string }[];
  isSearch?: boolean;
  placeholder?: string;
  isResetSearchChangeTab?: boolean;
  onSearch?: (value: string) => void;
};

const UserPageTabContent = (props: Props) => {
  const router = useRouter();

  const [keySearch, setKeySearch] = useState<string>('');
  const debouncedKeySearch = useDebounce<string>(keySearch, 500);

  useEffect(() => {
    props.onSearch?.(debouncedKeySearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeySearch]);

  useRouterChange(
    () => undefined,
    () => {
      if (props.isResetSearchChangeTab) setKeySearch('');
    }
  );

  return (
    <Wrapper className='custom__tab'>
      <Tabs className='hide-scrollbar'>
        {props.tabs.map((tab, index) => {
          return (
            <div
              key={index}
              className={'tab-item' + (tab.active ? ' --active' : '')}
              onClick={() => !tab.active && router.push(tab.url)}>
              {tab.title}
            </div>
          );
        })}
      </Tabs>

      {props.isSearch && (
        <Search>
          <Input
            value={keySearch}
            placeholder={props.placeholder}
            onChange={(e) => setKeySearch(e.target.value)}
            onPressEnter={() => props.onSearch && props.onSearch(debouncedKeySearch || '')}
          />
          <Icon
            iconName='search'
            onClick={() => props.onSearch && props.onSearch(debouncedKeySearch || '')}
          />
        </Search>
      )}
    </Wrapper>
  );
};

export default UserPageTabContent;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem 4rem;

  min-height: 6rem;
  padding: 1.2rem 4rem;

  border-bottom: var(--border-1px);

  &::-webkit-scrollbar {
    display: none;
  }

  ${maxMedia.medium} {
    flex-direction: column;
    align-items: flex-start;
    min-height: unset;
    padding: 0;
    border-bottom: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0 4.5rem;

  ${maxMedia.medium} {
    width: 100%;
    padding: 16px 20px;
    border-top: var(--border-1px);
    border-bottom: var(--border-1px);

    overflow-x: auto;
  }

  .tab-item {
    font-size: 16px;
    line-height: 1;
    color: var(--color-gray-6);

    cursor: pointer;

    &:hover {
      color: rgba(var(--color-primary-rgb-700), 80%);
    }
    &.--active {
      font-weight: 400;
      color: var(--color-primary-700);
    }
  }
`;

const Search = styled.div`
  position: relative;
  height: 42px;
  flex: auto;
  max-width: 40rem;

  ${maxMedia.medium} {
    flex: unset;
    width: calc(100% - 40px);
    min-width: unset;
    max-width: unset;
    height: 38px;
    margin-left: 20px;
  }

  .ant-input {
    height: 100%;
    padding-left: 2rem;
    padding-right: 6.5rem;
    font-size: 14px;
    background-color: var(--color-gray-2);
    border-radius: var(--border-radius-base);
    border-color: var(--color-gray-4);

    &::placeholder {
      line-height: 2.2rem;
      color: var(--color-gray-6);
    }

    ${maxMedia.medium} {
      padding-left: 10px;
      background-color: transparent;
      border-radius: 0.6rem;
    }
  }

  .my-icon.search {
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);

    svg {
      width: 2.4rem;
      height: 2.4rem;
      fill: var(--secondary);
    }

    ${maxMedia.medium} {
      right: 10px;
    }
  }
`;
