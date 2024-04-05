import { useRouter } from 'next/router';
import { Table } from 'antd';

import { ColumnsType } from 'antd/es/table';
import { GetRowKey } from 'antd/es/table/interface';

import { ReviewModel, SellerOrderItem } from 'models/seller.model';
import { ProductModel } from 'models/product.model';

import styled from 'styled-components';

type Props<T> = {
  isPagination?: boolean;
  loading: boolean;
  rowKey: string | GetRowKey<T> | undefined;
  columns: ColumnsType<T>;
  pageSize?: number;
  data: ReviewModel[] | ProductModel[] | null;
  total?: number;
};

const TableFragment = (props: Props<ProductModel | SellerOrderItem | ReviewModel | any>) => {
  const router = useRouter();

  return (
    <TableFragmentWrapper>
      <Table<ProductModel | SellerOrderItem | ReviewModel>
        loading={props.loading}
        locale={{
          emptyText: props.loading ? <div style={{ minHeight: '166px' }}></div> : false,
        }}
        pagination={
          props.isPagination && props.pageSize && props.total && props.total > props.pageSize
            ? {
                showSizeChanger: false,
                current: Number(router.query.page) || 1,
                total: props.total,
                onChange: (page) => {
                  const query = { ...router.query, page };
                  router.push({ query }, undefined, { shallow: true });
                },
              }
            : false
        }
        rowKey={props.rowKey}
        columns={props.columns}
        dataSource={props.data ?? []}
        scroll={{ x: (props.data?.length || 0) > 0 ? 1100 : undefined }}
      />
    </TableFragmentWrapper>
  );
};

const TableFragmentWrapper = styled.div`
  .Column__Product_Name {
    a {
      text-overflow: ellipsis;
      display: inline-block;
      overflow: hidden;
    }
  }
`;

export default TableFragment;
