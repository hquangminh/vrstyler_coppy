import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/type';
import { CloseSearch } from 'store/reducer/modal';

import { Button, Drawer, Input, InputRef } from 'antd';

import useWindowSize from 'hooks/useWindowSize';
import useLanguage from 'hooks/useLanguage';
import urlPage from 'constants/url.constant';
import { convertToHighlightText } from 'common/functions';

import Icon from 'components/Fragments/Icons';

import { Container } from 'styles/__styles';
import * as SC from './style';

const tags = [
  'Car',
  'Character',
  'Monster',
  'Stylized',
  'Chair',
  'Bed',
  'Game Package',
  'Animal',
  'Lowpoly Model',
  'Foliage',
];

const SearchDrawer = () => {
  const dispatch = useDispatch();
  const { width: screenW } = useWindowSize();
  const visible = useSelector((state: AppState) => state.modal.search);

  const router = useRouter();

  const [keySearch, setKeySearch] = useState<string>('');
  const [suggest, setSuggest] = useState<string[]>([]);

  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (visible) document.body.style.overflowY = 'hidden';
    else document.body.style.removeProperty('overflow-y');
  }, [visible]);

  const onChangeVisible = (visible: boolean) => {
    if (visible) inputRef.current?.focus();
    else inputRef.current?.blur();
  };

  const getSuggest = () => {
    // const arr = [...tags].filter((i) => i.toLowerCase().includes(keySearch.trim().toLowerCase()));
    // setSuggest(arr);
  };

  useEffect(() => {
    if (keySearch.trim()) getSuggest();
    else setSuggest([]);
  }, [keySearch]);

  const onSearch = () => {
    if (keySearch.trim()) {
      dispatch(CloseSearch());
      router.push('/explore/all?s=' + keySearch.trim());
    }
  };
  const { langLabel } = useLanguage();

  return (
    <Drawer
      placement={screenW <= 991 ? 'right' : 'top'}
      closable={false}
      height='100%'
      width='100%'
      drawerStyle={{ zIndex: 1001 }}
      styles={{ body: { padding: 0 } }}
      open={visible}
      onClose={() => dispatch(CloseSearch())}
      afterOpenChange={onChangeVisible}>
      <SC.Wrapper>
        <SC.SearchBox>
          <Container className='box-search_content'>
            <SC.BtnIcon onClick={onSearch}>
              <Icon iconName='search' />
            </SC.BtnIcon>
            <Input
              ref={inputRef}
              placeholder={langLabel.search_drawer_placeholder}
              bordered={false}
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              onPressEnter={onSearch}
            />
            <SC.BtnIcon onClick={() => dispatch(CloseSearch())}>
              <Icon iconName='close' />
            </SC.BtnIcon>
          </Container>
        </SC.SearchBox>

        <SC.SearchExpand>
          <Container>
            {suggest?.length > 0 && (
              <SC.SearchRecommend>
                {suggest?.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link href={'/'} legacyBehavior>
                        <a
                          dangerouslySetInnerHTML={{
                            __html: convertToHighlightText(item, keySearch.trim()),
                          }}
                        />
                      </Link>
                    </li>
                  );
                })}
              </SC.SearchRecommend>
            )}

            <SC.SearchPopular>
              <h4>{langLabel.search_drawer_popular}</h4>
              <div className='tag-list'>
                {tags.map((tag) => {
                  const link =
                    urlPage.explore.replace('{category}', 'all') + `?s=${tag.replace(/\s/g, '+')}`;
                  return (
                    <Button
                      key={tag}
                      className='tag-item'
                      type='text'
                      onClick={() => dispatch(CloseSearch())}>
                      <Link href={link}>{tag}</Link>
                    </Button>
                  );
                })}
              </div>
            </SC.SearchPopular>
          </Container>
        </SC.SearchExpand>
      </SC.Wrapper>
    </Drawer>
  );
};

export default SearchDrawer;
