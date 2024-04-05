import { Select } from 'antd';

import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';

const SelectLanguage_Style = styled.div`
  .ant-select {
    width: 100%;
    .ant-select-selector {
      height: 36px;
      border-radius: 4px;
    }
  }
`;

export default function SelectLanguage() {
  const { languages, langCode, handleChangeLanguage } = useLanguage();

  return (
    <SelectLanguage_Style>
      <Select
        value={langCode}
        options={
          languages
            ? languages.map((i) => ({ label: i.language_name, value: i.language_code }))
            : [
                { label: 'English', value: 'en' },
                { label: '한국인', value: 'kr' },
                { label: '日本', value: 'jp' },
              ]
        }
        onChange={handleChangeLanguage}
      />
    </SelectLanguage_Style>
  );
}
