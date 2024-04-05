import { CSSProperties, ReactNode, memo, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { CloseCircleFilled } from '@ant-design/icons';
import { Input, DatePicker, Select, Button, ConfigProvider, Spin, Flex, Empty } from 'antd';
import { SelectProps } from 'antd/lib';

import useDebounce from 'hooks/useDebounce';
import useLanguage from 'hooks/useLanguage';
import { searchDebounce } from 'common/functions';

import Icon from 'components/Fragments/Icons';

import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

export type FilterItem = {
  style?: CSSProperties;
  placeholder: string;
  selectType?: string;
  values: SelectProps['options'];
  data?: Function | number | string;
  type: string;
  loadingLoad?: boolean;
  loadingOption?: boolean;
  total?: number;
  selectRef?: any;
  onScroll?: (e: any) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
};

type Props = {
  uploadName?: string | ReactNode;
  totalLabel?: string;
  totalData?: number | string;
  searchType?: 'name' | 'title' | '';
  isFilterDate?: boolean;
  dataRangePicker?: [dayjs.Dayjs, dayjs.Dayjs];
  filterLists?: FilterItem[];
  onFilter?: any;
  isLine?: boolean;
  placeholderSearch?: string;
  valueSearch?: string;
};

const FilterFragments = memo(function FilterFragments(props: Props) {
  const {
    searchType,
    placeholderSearch,
    isFilterDate,
    filterLists,
    uploadName,
    isLine = false,
    onFilter,
    valueSearch,
  } = props;

  const { t } = useLanguage();

  const [keySearch, setKeySearch] = useState<string | undefined>(props.valueSearch);
  const keySearchDebounce = useDebounce(keySearch, 500);

  useEffect(() => {
    setKeySearch(valueSearch);
  }, [valueSearch]);

  useEffect(() => {
    const keySearchTrim = keySearchDebounce?.trim();
    const valueSearchTrim = valueSearch?.trim();
    if (keySearchTrim !== valueSearchTrim) onFilter({ value: keySearchDebounce, type: searchType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySearchDebounce]);

  return (
    <HeaderWrapper $isLine={isLine}>
      {props.totalLabel && (
        <TotalWrapper>
          <div>
            <h3
              dangerouslySetInnerHTML={{
                __html: props.totalLabel.replace(
                  '{{total}}',
                  `<span>${props.totalData?.toString() ?? '0'}</span>`
                ),
              }}
            />
          </div>
        </TotalWrapper>
      )}
      <FilterBox id='selectBox'>
        <ConfigProvider theme={{ token: { fontSizeLG: 14 } }}>
          {searchType && (
            <Input
              size='large'
              placeholder={placeholderSearch}
              className='search__input filter-item'
              suffix={<Icon iconName='search' />}
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
            />
          )}

          {isFilterDate && (
            <DatePicker.RangePicker
              className='filter-item'
              size='large'
              inputReadOnly
              allowClear={{ clearIcon: <CloseCircleFilled onClick={(e) => e.stopPropagation()} /> }}
              presets={[
                {
                  label: t('dashboard_date_picker_last_7_days'),
                  value: [dayjs().add(-7, 'd'), dayjs()],
                },
                {
                  label: t('dashboard_date_picker_last_30_days'),
                  value: [dayjs().add(-30, 'd'), dayjs()],
                },
              ]}
              value={props.dataRangePicker}
              disabledDate={(currentDate) => dayjs().isBefore(currentDate)}
              onChange={(value) => onFilter({ value, type: 'date' })}
            />
          )}

          {filterLists?.length &&
            filterLists.map((item) => {
              if (item.selectType === 'search')
                return (
                  <Select
                    key={item.type}
                    ref={item.selectRef}
                    size='large'
                    style={{ ...item.style, inlineSize: 300 }}
                    virtual={false}
                    allowClear={true}
                    showSearch={true}
                    filterOption={false}
                    placeholder={item.placeholder}
                    value={typeof item.data === 'function' ? item.data() : item.data ?? undefined}
                    options={item.values?.map((i) => i)}
                    popupClassName='select-custom-scroll'
                    dropdownRender={(menu) => (
                      <>
                        {item.loadingOption && (
                          <Flex align='center' justify='center' style={{ height: 134 }}>
                            <Spin />
                          </Flex>
                        )}
                        {!item.loadingOption && menu}
                      </>
                    )}
                    notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    onClear={item.onClear}
                    onChange={(value) => onFilter({ value, type: item.type })}
                    className='filter__box filter-item'
                    onSearch={searchDebounce((value) => item.onSearch?.(value))}
                    onPopupScroll={item.onScroll}
                  />
                );

              return (
                <Select
                  key={item.type}
                  size='large'
                  style={{ ...item.style, minWidth: '130px' }}
                  placeholder={item.placeholder}
                  onChange={(value) => onFilter({ value, type: item.type })}
                  value={typeof item.data === 'function' ? item.data() : item.data ?? undefined}
                  allowClear={true}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className='filter__box filter-item'>
                  {item.values?.map((v) => (
                    <Select.Option value={v.value} label={v.label} key={v.value + ''}>
                      {v.label}
                    </Select.Option>
                  ))}
                </Select>
              );
            })}

          {uploadName && (
            <Button size='large' type='primary' className='btn__upload'>
              {uploadName}
            </Button>
          )}
        </ConfigProvider>
      </FilterBox>
    </HeaderWrapper>
  );
});

export default FilterFragments;

const HeaderWrapper = styled.div<{ $isLine: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px 0;
  border-bottom: ${(props) => (props.$isLine ? '1px solid var(--color-gray-4)' : 'none')};

  .total {
    width: fit-content;
    font-size: 20px;
    color: var(--color-gray-11);
    white-space: nowrap;

    span {
      color: #cf293f;
      font-weight: 600;
    }
  }
`;

const FilterBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .selectBox {
    .ant-select-item {
      color: #434343;
    }
  }

  .filter__box {
    .ant-select-selector {
      align-items: center;

      input {
        height: 100% !important;
      }
    }
    .anticon-search {
      color: var(--color-gray-7);
    }
  }

  .search__input {
    width: 300px;
  }

  input::placeholder,
  .ant-select-selection-placeholder {
    font-size: 14px;
  }

  .btn__upload {
    min-width: 173px;
    border-radius: 4px;
    a:active,
    a:hover {
      color: white;
    }
  }

  input {
    height: 100%;
  }

  ${maxMedia.custom(1200)} {
    flex-wrap: wrap;

    .filter-item {
      flex: 100%;
      height: 41px;
    }

    .search__input {
      max-width: initial;
    }
  }

  .ant-select-selection-item,
  .truncate-label {
    display: inline;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .ant-select-selection-search-input {
    padding-inline-end: 15px !important;
  }
`;

const TotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 24px;
    color: var(--color-gray-11);

    span {
      color: var(--color-primary-700);
      font-weight: 600;
    }
  }

  .subtitle {
    margin-top: 8px;
    font-size: 16px;
    color: var(--color-gray-11);

    span {
      color: #f43d4f;
      font-weight: 600;
    }
  }
`;
