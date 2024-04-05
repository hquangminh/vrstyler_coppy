import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// prettier-ignore
import { SortableContainer, SortableContainerProps, SortableElement, SortableElementProps } from 'react-sortable-hoc';
import { Button, Flex, Result, Space, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import useLanguage from 'hooks/useLanguage';
import { message } from 'lib/utils/message';
import { isUUID, handlerMessage } from 'common/functions';
import urlPage from 'constants/url.constant';
import showroomServices from 'services/showroom-services';

import ToolCategory from './Fragments/ToolCategory';
import ToolCategoryProduct from './Fragments/ProductCarousel';
import DecorationBanner from './Fragments/Banner';
import DecorationBannerEditor from './Fragments/BannerEditor';
import DecorationImageCarousel from './Fragments/ImageCarousel';
import DecorationImageCarouselEditor from './Fragments/ImageCarouselEditor';
import ProductEditor from './Fragments/ProductEditor';

import {
  ShowroomDecorationModel,
  ShowroomDecorationSection,
  ShowroomThemeModel,
} from 'models/showroom.models';

import * as SC from './style';

type DecorationSection = { selected?: boolean } & ShowroomDecorationModel;
type Props = { themeID: string };

const ShowroomDecoration = ({ themeID }: Props) => {
  const { langCode, langLabel, t } = useLanguage();

  const [isFetching, setIsFetching] = useState<boolean>(true);

  const [themes, setThemes] = useState<ShowroomThemeModel | null>(null);

  const [decorations, setDecorations] = useState<DecorationSection[]>([]);
  const [loadingPublic, setLoadingPublic] = useState<boolean>(false);
  const [decorationIdOrigin, setDecorationIdOrigin] = useState<string[]>([]);
  const [shouldPromptUnload, setShouldPromptUnload] = useState<string | undefined>('inProgress');

  const decorationRef = useRef<HTMLDivElement>(null);

  const decorationSelect = decorations.find((i) => i.selected);
  const checkNewSectionAdd = decorations
    .filter((item) => isUUID(item.id))
    .every((item) => item.status === true);

  const onSortSection = useCallback(async () => {
    const decorationIdNew = decorations.filter((i) => isUUID(i.id)).map((i) => i.id);
    const isSorting = JSON.stringify(decorationIdOrigin) !== JSON.stringify(decorationIdNew);

    if (isSorting) {
      await showroomServices
        .sortDecorationSection(
          themeID,
          decorations
            .filter((i) => isUUID(i.id))
            .map((prod, index) => ({ section_id: prod.id, orderid: index + 1 }))
        )
        .then(() => setDecorationIdOrigin(decorations.filter((i) => isUUID(i.id)).map((i) => i.id)))
        .catch((error) => console.log('error', error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decorationIdOrigin, decorations, themeID]);

  useEffect(() => {
    onSortSection();
  }, [onSortSection]);

  const fetchDecorationSection = useCallback(async () => {
    await showroomServices
      .getDecorationSection(themeID)
      .then((res) => {
        const data: ShowroomDecorationSection[] = res.data;
        setThemes(res.theme);
        setDecorations(
          data.sort((a, b) => a.orderid - b.orderid).map((i) => i.market_showroom_section)
        );
        setDecorationIdOrigin(data.map((i) => i.market_showroom_section.id));
      })
      .catch(() => message.destroy())
      .finally(() => setIsFetching(false));
  }, [themeID]);

  useEffect(() => {
    fetchDecorationSection();
  }, [fetchDecorationSection]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (decorations.length > decorationIdOrigin.length && shouldPromptUnload === 'inProgress') {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    if (
      decorations.length > decorationIdOrigin.length ||
      (decorationIdOrigin.length !== 0 && shouldPromptUnload === 'inProgress')
    )
      window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [decorationIdOrigin.length, decorations.length, shouldPromptUnload]);

  const onSelectDecoration = (id: string) => {
    setDecorations((current) => current.map((i) => ({ ...i, selected: i.id === id })));
  };

  const onAddDecoration = (type: number) => {
    let item: DecorationSection = { id: (decorations.length + 1).toString(), type, selected: true };
    setDecorations((current) => [...current.map((i) => ({ ...i, selected: false })), item]);
    setShouldPromptUnload(undefined);
  };

  const onUpdateDecorationSection = (id: string, data: ShowroomDecorationModel) => {
    setDecorations((current) => current.map((i) => (i.id === id ? { ...i, ...data } : { ...i })));
  };

  const onDeleteDecorationSection = async (id: string) => {
    if (isUUID(id)) {
      await showroomServices
        .deleteDecorationSection(themeID, id)
        .then(() => {
          setDecorations((current) => current.filter((i) => i.id !== id));
          setDecorationIdOrigin((current) => current.filter((i) => i !== id));
          handlerMessage(langLabel.message_delete_success, 'success');
        })
        .catch((error: any) => {
          console.log('Del Decoration Section', error);
        });
    } else {
      setDecorations((current) => current.filter((i) => i.id !== id));
      handlerMessage(langLabel.message_delete_success, 'success');
    }
  };

  const onSortEnd = async ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    let newDecoration = [...decorations];
    let decorationItem = newDecoration[oldIndex];
    newDecoration.splice(oldIndex, 1);
    newDecoration.splice(newIndex, 0, decorationItem);
    setDecorations(newDecoration);
  };

  const onPublicTheme = async () => {
    setLoadingPublic(true);
    try {
      await showroomServices.publicSection(themeID);
      setThemes((s: any) => ({ ...s, status: true }));
      setDecorations((prevState) => prevState.map((p) => ({ ...p, status: true })));

      handlerMessage(langLabel.dashboard_theme_publish_success_message, 'success');
      setLoadingPublic(false);
    } catch (error: any) {
      setLoadingPublic(false);
    }
  };

  if (isFetching)
    return (
      <Flex justify='center' align='center' style={{ height: 500 }}>
        <Spin />
      </Flex>
    );
  else if (!themes)
    return (
      <Result
        status='404'
        title='Oops!'
        subTitle={t('dashboard_theme_not_found_title')}
        extra={
          <Button type='primary'>
            <Link href={urlPage.dashboard_showroom_theme}>{t('btn_back')}</Link>
          </Button>
        }
      />
    );

  return (
    <SC.Wrapper>
      <SC.Header>
        <div className='Showroom__Decoration__Btn_Back'>
          <Button type='text' icon={<LeftOutlined />}>
            <Link href={'/' + langCode + urlPage.dashboard_showroom_theme}>
              {langLabel.btn_back}
            </Link>
          </Button>
        </div>
        <div className='Showroom__Decoration__Theme_Name'>{themes?.name} </div>
        <SC.Save>
          <Space size={16}>
            <Button type='primary' className='btn__preview'>
              <a
                href={`/${langCode}${urlPage.dashboard_showroom_theme_preview.replace(
                  '{themeID}',
                  themeID
                )}`}
                target='_blank'
                rel='noreferrer'>
                {langLabel.btn_preview || 'Preview'}
              </a>
            </Button>

            <Button
              type='primary'
              onClick={onPublicTheme}
              loading={loadingPublic}
              disabled={checkNewSectionAdd || decorationIdOrigin.length === 0}>
              {themes.status && !checkNewSectionAdd
                ? langLabel.dashboard_theme_btn_publish_again
                : langLabel.dashboard_theme_btn_publish}
            </Button>
          </Space>
        </SC.Save>
      </SC.Header>

      <SC.DecorationEditor>
        <SC.DecorationCreator>
          <div className='decoration-creator-container' ref={decorationRef}>
            <SortTableList
              helperClass='sortableHelper'
              helperContainer={decorationRef.current || undefined}
              onSortEnd={onSortEnd}
              lockAxis={'y'}
              useWindowAsScrollContainer={true}
              useDragHandle>
              {decorations?.map((item, index) => {
                const decorationProps = {
                  key: item.id,
                  focused: item.selected,
                  onSelect: () => onSelectDecoration(item.id),
                  onDelete: () => onDeleteDecorationSection(item.id),
                };
                if (item.type === 1)
                  return (
                    <SortableItem index={index} key={`item-${index}`}>
                      <DecorationBanner {...decorationProps} image={item.image} />
                    </SortableItem>
                  );

                if (item.type === 2)
                  return (
                    <SortableItem index={index} key={`item-${index}`}>
                      <DecorationImageCarousel
                        {...decorationProps}
                        aspect={item.carousel_aspect}
                        images={item.market_showroom_section_images?.map((i) => i.image)}
                      />
                    </SortableItem>
                  );

                if (item.type === 3)
                  return (
                    <SortableItem index={index} key={`item-${index}`}>
                      <ToolCategoryProduct
                        {...decorationProps}
                        listProduct={item?.market_showroom_section_products}
                      />
                    </SortableItem>
                  );
              })}
            </SortTableList>

            <ToolCategory
              disabled={decorations.some((i) => !isUUID(i.id))}
              banner={decorations.filter((i) => i.type === 1).length}
              carousel={decorations.filter((i) => i.type === 2).length}
              product={decorations.filter((i) => i.type === 3).length}
              onAdd={onAddDecoration}
            />
          </div>
        </SC.DecorationCreator>

        <SC.DecorationEditorPanel>
          {decorationSelect && decorationSelect.type === 1 && (
            <DecorationBannerEditor
              themeId={themeID}
              data={decorationSelect}
              onFinish={(data) => onUpdateDecorationSection(decorationSelect.id, data)}
              setShouldPromptUnload={setShouldPromptUnload}
            />
          )}
          {decorationSelect && decorationSelect.type === 2 && (
            <DecorationImageCarouselEditor
              themeId={themeID}
              data={decorationSelect}
              onFinish={(data) => onUpdateDecorationSection(decorationSelect.id, data)}
              setShouldPromptUnload={setShouldPromptUnload}
            />
          )}
          {decorationSelect && decorationSelect.type === 3 && (
            <ProductEditor
              themeId={themeID}
              data={decorationSelect}
              onFinish={(data) => onUpdateDecorationSection(decorationSelect.id, data)}
              setShouldPromptUnload={setShouldPromptUnload}
            />
          )}
        </SC.DecorationEditorPanel>
      </SC.DecorationEditor>
    </SC.Wrapper>
  );
};

export default ShowroomDecoration;

const SortTableList: React.ComponentClass<SortableContainerProps & { children: ReactNode }> =
  SortableContainer(({ children }: { children: ReactNode }) => <div>{children}</div>);

const SortableItem: React.ComponentClass<SortableElementProps & { children: ReactNode }> =
  SortableElement(({ children }: { children: ReactNode }) => <div>{children}</div>);
