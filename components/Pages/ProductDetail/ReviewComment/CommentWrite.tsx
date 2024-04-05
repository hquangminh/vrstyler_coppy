import { useCallback, useEffect, useRef } from 'react';

import styled from 'styled-components';
import { Button, notification } from 'antd';
import { Mention, MentionsInput } from 'react-mentions';

import useLanguage from 'hooks/useLanguage';
import debounce from 'common/functions/debounce';
import commentServices from 'services/comment-services';

import { UserModel } from 'models/user.models';

import { maxMedia } from 'styles/__media';

type Props = {
  /* eslint-disable no-unused-vars */
  id?: string;
  value: string;
  submitting?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const CommentWrite = (props: Props) => {
  const { onChange, onSubmit, submitting, value, id } = props;

  const { langLabel } = useLanguage();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value) inputRef.current?.focus();
  }, [value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchUser = useCallback(
    debounce((text: string, callback: any) => {
      commentServices
        .searchUser(text)
        .then(({ data }) =>
          data.map((user: UserModel) => ({
            display: user.nickname,
            id: `${user.id}?type=${user.type}`,
          }))
        )
        .then(callback);
    }, 1000),
    []
  );

  const handelSubmit = () => {
    if (value.trim()) onSubmit();
    else
      notification.error({
        message: 'Please write your comment',
        placement: 'top',
        style: { width: '100%' },
        key: 'error_message',
      });
  };

  return (
    <Wrapper id={id}>
      <MentionsInput
        inputRef={inputRef}
        style={defaultStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        a11ySuggestionsListLabel={'Suggested mentions'}>
        <Mention
          markup='@[__display__](user:__id__)'
          trigger='@'
          data={onSearchUser}
          renderSuggestion={(_, __, highlightedDisplay, ___, focused) => (
            <div className={`user ${focused ? 'focused' : ''}`}>{highlightedDisplay}</div>
          )}
          style={{ color: 'var(--color-primary-700)', backgroundColor: 'var(--color-primary-100)' }}
        />
        <Mention
          markup='@[__display__](email:__id__)'
          trigger={/(([^\s@]+@[^\s@]+\.[^\s@]+))$/}
          data={(search) => [{ id: search, display: search }]}
          style={{ backgroundColor: '#d1c4e9' }}
        />
      </MentionsInput>
      <Button loading={submitting} onClick={handelSubmit} type='primary' disabled={!value.trim()}>
        {langLabel.btn_add_comment || 'Add Comment'}
      </Button>
    </Wrapper>
  );
};

export default CommentWrite;

const Wrapper = styled.div`
  padding-bottom: 20px;
  text-align: right;

  .ant-mentions {
    text-align: left;
  }

  .ant-btn {
    margin-top: 15px;
    padding: 10px 48px;
    height: auto;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;

    ${maxMedia.small} {
      padding: 5px 30px;
    }
  }
`;

const defaultStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      minHeight: 90,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '1px solid #d9d9d9',
      outline: 'none',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
      maxHeight: 200,
      overflow: 'auto',
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      textAlign: 'left',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};
