import { useState } from 'react';

import useRouterChange from 'hooks/useRouterChange';
import { Checkbox, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import useLanguage from 'hooks/useLanguage';

import { CategoryModel } from 'models/category.models';

import styled from 'styled-components';

const pageSize = 10;

type Props = {
  listChecked: string[];
  // eslint-disable-next-line no-unused-vars
  onChecked: (e: CheckboxChangeEvent, id: string) => void;
  categories: {
    total: number;
    data: CategoryModel[] | null;
  };
  loading: boolean;
  setListChecked: React.Dispatch<React.SetStateAction<string[]>>;
};

const TableComponent = (props: Props) => {
  const { langLabel } = useLanguage();

  const [page, setPage] = useState(1);

  const columns: ColumnsType<CategoryModel> = [
    {
      title: langLabel.category_name,
      dataIndex: 'title',
      key: 'title',
      className: 'table__title',
    },
    {
      title: langLabel.action,
      dataIndex: 'action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={props.listChecked.includes(record.id)}
          onChange={(e) => props.onChecked(e, record.id)}
        />
      ),
    },
  ];

  return (
    <Table__wrapper>
      <Table
        loading={props.loading}
        pagination={
          props.categories.total > pageSize
            ? {
                current: page,
                pageSize,
                total: props.categories.total,
                onChange: (page) => setPage(page),
                showSizeChanger: false,
              }
            : false
        }
        key='showroom-category'
        rowKey='id'
        columns={columns}
        dataSource={props.categories.data || []}
        scroll={{ x: props.categories.data && props.categories.data?.length > 0 ? 992 : undefined }}
      />
    </Table__wrapper>
  );
};

const Table__wrapper = styled.div`
  margin-top: 15px;

  .table__title {
    color: var(--color-gray-11);
    font-weight: 500;
  }

  th.ant-table-cell {
    font-weight: 400;
  }

  .ant-checkbox .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
`;

export default TableComponent;
