import { CSSProperties, useRef } from 'react';

import { Input, InputRef } from 'antd';

import Icon from 'components/Fragments/Icons';

import styled from 'styled-components';

const Wrapper = styled.div`
  .ant-input {
    height: 42px;
    border-radius: 10px;
    border: solid 1px var(--color-gray-4);
    &::placeholder {
      color: var(--color-gray-6);
    }
  }
  .search {
    font-size: 14px;
    color: #94949c;
    line-height: 1.4;
  }
`;

interface Props {
  className?: string;
  value?: string;
  placeholder?: string;
  inputStyle?: CSSProperties;
  // eslint-disable-next-line no-unused-vars
  onSearch?: (value?: string) => void;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value?: string) => void;
}

export default function InputSearch(props: Props) {
  const inputRef = useRef<InputRef>(null);

  return (
    <Wrapper className={props.className}>
      <Input
        ref={inputRef}
        value={props.value}
        style={props.inputStyle}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange && props.onChange(e.target.value)}
        onPressEnter={() => {
          inputRef.current?.blur();
          props.onSearch && props.onSearch(props.value ?? inputRef.current?.input?.value);
        }}
        suffix={
          <Icon
            iconName='search'
            onClick={() => props.onSearch && props.onSearch(inputRef.current?.input?.value)}
          />
        }
      />
    </Wrapper>
  );
}
