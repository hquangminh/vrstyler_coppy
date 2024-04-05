import styled from 'styled-components';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';

import { UserPageOptionFilterModel } from 'models/user.models';

type Props = {
  selected?: UserPageOptionFilterModel;
  onChange: (value: UserPageOptionFilterModel) => void;
};

const FilterModel = (props: Props) => {
  const i18n = useLanguage();

  const options: { label: string; value: UserPageOptionFilterModel }[] = [
    { label: i18n.t('my_profile_model_filter_recently'), value: 'recently' },
    { label: i18n.t('my_profile_model_filter_oldest'), value: 'oldest' },
    { label: i18n.t('my_profile_model_filter_last_week'), value: 'lastweek' },
    { label: i18n.t('my_profile_model_filter_last_month'), value: 'lastmonth' },
    { label: 'A-Z', value: 'az' },
    { label: 'Z-A', value: 'za' },
  ];

  return (
    <Wrapper>
      <Select
        value={props.selected ?? options[0].value}
        suffixIcon={<CaretDownOutlined className='ant-select-suffix' />}
        options={options.map((i) => i)}
        getPopupContainer={(triggerNode) => triggerNode}
        onChange={(value: UserPageOptionFilterModel) => props.onChange(value)}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    min-width: 12rem;
    border-radius: 0.5rem;
  }

  .ant-select-selection-item,
  .anticon-caret-down {
    color: var(--color-main-6);
  }

  .ant-select-item {
    color: var(--color-gray-6);

    &:hover {
      color: rgba(var(--color-primary-rgb-700), 70%);
    }

    &.ant-select-item-option-selected {
      background-color: transparent;
      color: var(--color-main-6);
      font-weight: 400;
    }
  }
`;

export default FilterModel;
