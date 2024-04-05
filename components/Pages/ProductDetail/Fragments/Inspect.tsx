import { ReactNode } from 'react';

import { ConfigProvider, Descriptions } from 'antd';

import useLanguage from 'hooks/useLanguage';
import { ProductFileFormat } from 'constants/product.constant';

import Icon from 'components/Fragments/Icons';

import { ProductModel } from 'models/product.model';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

const listInfo: {
  title: string;
  key:
    | 'file_details'
    | 'import_in'
    | 'geometry'
    | 'vertices'
    | 'textures'
    | 'materials'
    | 'is_uv'
    | 'is_pbr'
    | 'is_animated'
    | 'is_rigged';
  type: 'normal' | 'list' | 'import-in' | 'y/n';
  value?: ReactNode;
}[] = [
  { title: 'Included 3D formats', key: 'file_details', type: 'list' },
  {
    title: 'Import in',
    key: 'import_in',
    value: (
      <div className='import-in d-flex align-items-center'>
        <Icon iconName='blender' />
        <Icon iconName='cinema4d' />
        <Icon iconName='unity' />
        <Icon iconName='unreal-engine' />
      </div>
    ),
    type: 'import-in',
  },
  { title: 'Geometry', key: 'geometry', type: 'list' },
  { title: 'Vertices', key: 'vertices', type: 'normal' },
  { title: 'Textures', key: 'textures', type: 'normal' },
  { title: 'Materials', key: 'materials', type: 'normal' },
  { title: 'UV Layers', key: 'is_uv', type: 'y/n' },
  { title: 'PBR', key: 'is_pbr', type: 'y/n' },
  { title: 'Animation', key: 'is_animated', type: 'y/n' },
  { title: 'Rigged', key: 'is_rigged', type: 'y/n' },
];

const ProductDetailInspect = ({ data }: { data: ProductModel }) => {
  const i18n = useLanguage();

  return (
    <InspectWrapper>
      <h3 className='Product__Inspect__Title'>{i18n.t('product_technical_information_label')}</h3>

      <div className='Product__Inspect__Content'>
        {listInfo.map((item) => {
          return (
            <div className='Product__Inspect__Item' key={item.key}>
              <label className='Product__Inspect__Item_Title'>
                {item.key === 'file_details' ? i18n.t('product_format_label') : item.title}
              </label>
              <div className='Product__Inspect__Item_Value text-right'>
                {item.key === 'import_in' && item.value}
                {item.key !== 'import_in' && (
                  <>
                    {item.type === 'normal' && item.key && (
                      <span>{data[item.key]?.toString()}</span>
                    )}
                    {item.type === 'y/n' && item.key && (data[item.key] ? 'Yes' : 'No')}
                    {item.type === 'list' && item.key === 'geometry' && (
                      <>
                        {data.geometry?.triangles && <p>Triangles {data.geometry.triangles}</p>}
                        {data.geometry?.quads && <p>Quads {data.geometry.quads}</p>}
                        {data.geometry?.total_triangles && (
                          <p>Total triangles {data.geometry.total_triangles}</p>
                        )}
                      </>
                    )}
                    {item.type === 'list' && item.key === 'file_details' && (
                      <ConfigProvider
                        theme={{
                          token: { colorTextTertiary: 'var(--color-gray-8)' },
                          components: {
                            Descriptions: {
                              colonMarginRight: 0,
                              itemPaddingBottom: 4,
                              contentColor: 'rgba(0, 0, 0, 0.45)',
                            },
                          },
                        }}>
                        <Descriptions
                          colon={false}
                          column={1}
                          items={ProductFileFormat.filter((i: any) =>
                            data.file_details?.includes(i.key)
                          ).map(({ key, title, format }) => ({
                            key,
                            label: title,
                            children: `(${format})`,
                          }))}
                        />
                      </ConfigProvider>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </InspectWrapper>
  );
};

export default ProductDetailInspect;

const InspectWrapper = styled.div`
  grid-area: 2 / 2 / 6 / 3;

  height: fit-content;
  margin-top: 30px;
  border: 1px solid #f0f0f0;

  ${maxMedia.medium} {
    margin: 0 -20px;
    margin-top: 40px;
  }

  .Product__Inspect__Title {
    padding: 15px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-gray-9);
    background-color: var(--color-gray-5);
  }

  .Product__Inspect__Item {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    background-color: #fafafa;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-line);
    }

    .Product__Inspect__Item_Title {
      font-size: 14px;
      color: var(--text-title);
    }
    .Product__Inspect__Item_Value {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-gray-8);

      .import-in {
        gap: 10px;
        .my-icon {
          height: 20px;
          width: auto;
        }
      }
    }
  }

  .ant-descriptions {
    .ant-descriptions-view table {
      width: auto;
    }
    .ant-descriptions-item-container {
      display: flex;
      justify-content: end;
    }
    .ant-descriptions-item-content {
      flex: none;
      font-weight: 400;
    }
  }
`;
