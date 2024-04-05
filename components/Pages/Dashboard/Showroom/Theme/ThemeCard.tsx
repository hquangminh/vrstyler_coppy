import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useLanguage from 'hooks/useLanguage';

import { Button, Dropdown, Input, InputRef, Modal, Spin, Tooltip } from 'antd';
import { PlusOutlined, MoreOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { handlerMessage } from 'common/functions';
import urlPage from 'constants/url.constant';
import config from 'config';

import showroomServices from 'services/showroom-services';
import { ShowroomThemeModel } from 'models/showroom.models';

import styled from 'styled-components';

const ThemeCard_Wrap = styled.div`
  width: 240px;
  .ant-spin-nested-loading {
    min-height: unset;
  }
  .Theme_Card__Action {
    position: absolute;
    top: -2px;
    left: -2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding: 31px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 8px;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(var(--color-gray-rgb-9), 0.6);
    transition: all 200ms ease-in-out;
  }
  .Theme_Card__Btn_Design {
    height: 40px;
    color: var(--color-gray-rgb-9);
    border: none;
    &:hover {
      color: var(--color-primary-500);
    }
  }
  .Theme_Card__Btn_Preview {
    height: 40px;
  }
  .Theme_Card__Publish {
    padding-top: 8px;
    display: flex;
    align-items: center;
    color: #369ca5;
    font-size: 16px;
    font-weight: 400;
    p {
      padding-left: 8px;
    }
  }
`;
const Theme_Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  aspect-ratio: 6/7;
  padding: 33px;
  border-radius: 8px;
  border: solid 2px #e5e5e5;
  background-color: #fff;
  cursor: pointer;

  &:hover .Theme_Card__Action {
    opacity: 1;
    visibility: visible;
  }

  .Theme_Card__Preview_Content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .anticon {
      font-size: 30px;
      color: #bfbfbf;
    }
  }
`;
const Theme_Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 16px;

  .Theme_Card__Name {
    font-size: 16px;
    color: #000;
    width: 212px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .ant-input {
    padding: 0;
  }
  .ant-input.ant-input-disabled {
    padding: 0;
    background-color: transparent;
    border: none;
    border-color: none;
    box-shadow: none;
  }

  .anticon {
    font-size: 20px;
    color: #8c8c8c;
  }
  .ant-dropdown-menu {
    width: 140px;
  }
  .delete_item {
    &:hover {
      background-color: var(--color-red-1) !important;
    }
  }
  .ant-dropdown-trigger {
    padding: 0;
    &:hover,
    &:active {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-gray-6);
      width: 24px;
      height: 24px;
      border-radius: 5px;
      svg {
        color: #ffffff;
      }
    }
  }
  .ant-dropdown-open {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-gray-6);
    border-radius: 5px;
    svg {
      color: #ffffff;
    }
  }
  .ant-dropdown.reset-style {
    left: 100px !important;
    .ant-dropdown-menu-item {
      &:hover {
        background-color: var(--color-primary-100);
      }
    }
  }
`;

type Props = {
  data?: ShowroomThemeModel;
  themeNameDefault?: string;
  setThemes: React.Dispatch<React.SetStateAction<ShowroomThemeModel[]>>;
};

export default function ShowroomThemeCard(props: Props) {
  const router = useRouter();
  const { data, setThemes, themeNameDefault } = props;
  const { langCode, langLabel } = useLanguage();

  const inputRef = useRef<InputRef>(null);
  const refComponent = useRef<HTMLDivElement>(null);

  const [adding, setAdding] = useState<boolean>(false);
  const [themeName, setThemeName] = useState<string | undefined>();

  const thumbnailRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setThemeName(data?.name);
  }, [data]);

  useEffect(() => {
    if (data)
      thumbnailRef.current?.setAttribute(
        'src',
        `${config.urlRoot}/dashboard/showroom/theme/thumbnail/${data.id}`
      );
  }, [data]);

  const onGoToDecoration = (themeID: string) => {
    const url = urlPage.dashboard_showroom_theme_decoration.replace('{themeID}', themeID);
    router.push('/' + langCode + url);
  };

  const onAddTheme = async () => {
    setAdding(true);
    await showroomServices
      .addTheme(themeNameDefault || '')
      .then(({ data }) => onGoToDecoration(data.id))
      .catch((error: any) => {
        console.log('Add failed', error);
        setAdding(false);
      });
  };

  const deleteTheme = async (id: string | '') => {
    try {
      const { error } = await showroomServices.delTheme(id);
      if (!error) {
        setThemes((current) => current.filter((i) => i.id !== id));
        handlerMessage(langLabel.message_delete_success, 'success');
      }
    } catch (error: any) {
      console.log('Delete failed', error);
    }
  };

  const onPublishTheme = async () => {
    try {
      const { data: resData } = await showroomServices.publicSection(data?.id || '');

      setThemes((prevState) =>
        prevState.map((p) => ({
          ...p,
          status: data?.id === p.id ? resData === 'PUBLIC_OK' : false,
          market_showroom_sections_aggregate: {
            aggregate: {
              count: 0,
            },
          },
        }))
      );
      inputRef.current?.input?.setAttribute('disabled', '');
      inputRef.current?.input?.classList.add('ant-input-disabled');
      if (themeName === data?.name) {
        handlerMessage(langLabel.dashboard_theme_publish_success_message, 'success');
      } else {
        handlerMessage(langLabel.dashboard_theme_rename_success_message, 'success');
      }
    } catch (error: any) {
      console.log('Update failed', error);
    }
  };

  const onUpdateTheme = async () => {
    const params: any = {};

    params.name = themeName?.trim()
      ? themeName.replace(/\s{2,}/g, ' ').replace(/\.\s*/g, ' ')
      : data?.name;
    delete params['status'];

    try {
      const { data: resData } = await showroomServices.updateTheme(data?.id || '', params);
      setThemes((prevState) =>
        prevState.map((p) =>
          data?.id === p.id
            ? { ...p, ...resData }
            : { ...p, status: resData?.status ? false : p.status }
        )
      );
      inputRef.current?.input?.setAttribute('disabled', '');
      inputRef.current?.input?.classList.add('ant-input-disabled');
      if (themeName === data?.name) {
        handlerMessage(langLabel.dashboard_theme_publish_success_message, 'success');
      } else {
        handlerMessage(langLabel.dashboard_theme_rename_success_message, 'success');
      }
    } catch (error: any) {
      console.log('Update failed', error);
    }
  };

  const menuTheme = [
    {
      key: 'delete',
      label: langLabel.delete,
      style: { color: '#f43d4f' },
      className: 'delete_item',
      onClick: () => {
        Modal.confirm({
          title: langLabel.dashboard_theme_delete_confirm_question.replace(
            '{{name}}',
            data?.name ?? ''
          ),
          centered: true,
          onOk: () => deleteTheme(data?.id || ''),
          autoFocusButton: null,
        });
      },
    },

    {
      key: 'rename',
      label: langLabel.btn_rename,
      onClick: () => {
        inputRef.current?.input?.removeAttribute('disabled');
        inputRef.current?.input?.classList.remove('ant-input-disabled');
        inputRef.current!.focus({ cursor: 'end' });
      },
    },
    {
      key: 'publish',
      label:
        data?.status && data.market_showroom_sections_aggregate.aggregate.count > 0
          ? langLabel.dashboard_theme_btn_publish_again
          : langLabel.btn_publish,
      onClick: () => onPublishTheme(),
    },
  ];

  return (
    <ThemeCard_Wrap>
      <Spin spinning={adding}>
        <Theme_Preview>
          <div className='Theme_Card__Preview_Content'>
            {data ? <img src={data.screenshot} alt='' /> : <PlusOutlined />}
          </div>
          <div className='Theme_Card__Action'>
            <Button
              className='Theme_Card__Btn_Design'
              onClick={() => (data ? onGoToDecoration(data.id) : onAddTheme())}>
              {langLabel.dashboard_theme_start_with_this_design}
            </Button>
            {data && (
              <a
                href={`/${langCode}${urlPage.dashboard_showroom_theme_preview.replace(
                  '{themeID}',
                  data.id
                )}`}
                target='_blank'
                rel='noreferrer'
                className='d-block'>
                <Button className='Theme_Card__Btn_Preview w-100' type='primary'>
                  {langLabel.dashboard_theme_preview_design}
                </Button>
              </a>
            )}
          </div>
        </Theme_Preview>
        <Theme_Info ref={refComponent}>
          <Tooltip placement='bottomLeft' title={themeName || themeNameDefault}>
            <>
              <Input
                ref={inputRef}
                value={themeName || themeNameDefault}
                onChange={(e) => setThemeName(e.target.value)}
                onBlur={() => {
                  const trimmedThemeName = (themeName || themeNameDefault)
                    ?.trim()
                    .replace(/\.$/, '');
                  const trimmedDataName = data?.name?.trim().replace(/\.$/, '');

                  if (trimmedThemeName !== trimmedDataName) {
                    onUpdateTheme();
                  }
                }}
                bordered={false}
                maxLength={20}
                spellCheck={false}
                disabled
                className='Theme_Card__Name'
                onPressEnter={inputRef.current?.blur}
              />
            </>
          </Tooltip>
          {data && (
            <Dropdown
              getPopupContainer={() => refComponent.current || document.body}
              overlayClassName='reset-style'
              trigger={['click']}
              menu={{ items: menuTheme }}>
              <a onClick={(e) => e.preventDefault()}>
                <MoreOutlined />
              </a>
            </Dropdown>
          )}
        </Theme_Info>
        {data?.status && (
          <div className='Theme_Card__Publish'>
            <CheckCircleOutlined />
            <p>
              {data?.market_showroom_sections_aggregate?.aggregate?.count ?? 0 > 0
                ? langLabel.dashboard_theme_btn_publish_change
                : langLabel.published}
            </p>
          </div>
        )}
      </Spin>
    </ThemeCard_Wrap>
  );
}
