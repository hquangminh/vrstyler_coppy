import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { Breadcrumb, Col, Flex, Pagination, Row, Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import isArrayEmpty from 'common/functions/isArrayEmpty';
import urlPage from 'constants/url.constant';
import showroomServices from 'services/showroom-services';

import ResultEmpty from 'components/Fragments/ResultEmpty';
import InputSearch from './Fragments/InputSearch';
import ShowroomCard from './Fragments/ShowroomCard';

import { ShowroomModel, ShowroomType } from 'models/showroom.models';

import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const pageSize = 24;

const Wrapper = styled.div`
  padding: 30px 0 40px;
  .ant-breadcrumb ol li {
    font-size: 16px;
    color: var(--color-gray-7);
    &:last-child {
      font-weight: 500;
      color: var(--color-primary-700);
    }
  }
  .showroom-list-top-pagination {
    margin-top: 40px;
    text-align: center;
    ${maxMedia.xsmall} {
      .ant-pagination-prev,
      .ant-pagination-next,
      .ant-pagination-jump-prev,
      .ant-pagination-jump-next,
      .ant-pagination-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: 24px;
        height: 24px;
        min-width: unset;
        margin-right: 4px;
      }
    }
  }

  .ant-col {
    width: 100%;
  }
`;
const Header = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${maxMedia.small} {
    flex-wrap: wrap;
  }

  padding: 40px 0;
  .showroom-list-top-title {
    font-size: 32px;
    font-weight: normal;
    color: var(--color-gray-11);
  }
  .showroom-list-top-search {
    width: 345px;
    ${maxMedia.small} {
      min-width: 100%;
      padding-top: 16px;
    }
  }
`;

interface Props {
  type: ShowroomType;
  title: string;
}

const ShowroomListTop = ({ type, title }: Props) => {
  const { langLabel } = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);
  const [showroom, setShowroom] = useState<{ list: ShowroomModel[]; total: number }>({
    list: [],
    total: 0,
  });

  const onSearchShowroom = useCallback(
    async (page: number, name?: string) => {
      setLoading(true);
      const showroomType = type === 'review' ? 1 : type === 'view' ? 2 : 3;
      await showroomServices
        .filterShowroom(showroomType, pageSize, (page - 1) * pageSize, name)
        .then(({ data, total }) => setShowroom({ list: data, total }))
        .catch();
      setLoading(false);
    },
    [type]
  );

  useEffect(() => {
    onSearchShowroom(1);
  }, [onSearchShowroom]);

  const getPageName = () => {
    if (type === 'review') return 'Top Review';
    else if (type === 'view') return 'Top View';
    else if (type === 'sold') return 'Top Sold';
  };

  return (
    <Wrapper>
      <Container size='large'>
        <Breadcrumb
          separator='>'
          items={[
            { key: 'home', title: <Link href='/'>Home</Link> },
            { key: 'showroom', title: <Link href={urlPage.showroom}>Showroom</Link> },
            { key: 'page-name', title: getPageName() },
          ]}
        />

        <Header>
          <h1 className='showroom-list-top-title'>{title}</h1>
          <InputSearch
            className='showroom-list-top-search'
            placeholder={langLabel.showroom_search_placeholder}
            onSearch={(value) => {
              setName(value);
              setPage(1);
              onSearchShowroom(1, value);
            }}
          />
        </Header>

        {loading && (
          <Flex align='center' justify='center' style={{ minHeight: 300 }}>
            <Spin />
          </Flex>
        )}

        {!loading && !isArrayEmpty(showroom.list) && (
          <Row gutter={[40, 40]}>
            {showroom.list.map((item) => (
              <Col md={12} xl={8} xxl={6} key={item.market_user.id}>
                <ShowroomCard type={type} showroom={item} />
              </Col>
            ))}
          </Row>
        )}

        {!loading && isArrayEmpty(showroom.list) && (
          <ResultEmpty description={langLabel.showroom_result_empty_title} />
        )}

        {showroom.total > pageSize && (
          <Pagination
            className='showroom-list-top-pagination'
            total={showroom.total}
            pageSize={pageSize}
            current={page}
            showSizeChanger={false}
            onChange={(page) => {
              setPage(page);
              onSearchShowroom(page, name);
            }}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default ShowroomListTop;
