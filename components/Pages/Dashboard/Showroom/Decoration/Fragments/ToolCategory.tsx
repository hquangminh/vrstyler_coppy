import { Tooltip } from 'antd';
import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';

const Wrapper = styled.div<{ disabled?: boolean }>`
  padding: 40px 0;
  border: solid 2px var(--color-gray-5);
  background-color: #fff;
  opacity: ${(props) => (props.disabled ? 0.25 : 1)};
  text-align: center;
  transition: all 100ms ease-in-out;
  &:hover {
    border-color: var(--color-primary-700);
  }
  .toolbar-category {
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-gray-9);
    }
    &-caption {
      font-size: 16px;
      color: var(--color-gray-9);
    }
    &-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      padding: 40px 40px 0;
    }
    &-item {
      text-align: center;
      cursor: pointer;
      &:hover img {
        opacity: 1;
      }
      &.--disabled {
        opacity: 0.25;
        pointer-events: none;
      }
      img {
        width: 100%;
        height: auto;
        border: solid 1px var(--color-gray-6);
        border-radius: 4px;
        opacity: 0.5;
        transition: all 100ms ease-in-out;
      }
      &-name {
        margin-top: 16px;
        font-size: 14px;
        color: var(--color-gray-9);
      }
    }
  }
  .ant-tooltip {
    max-width: 320px;
    .ant-tooltip-inner {
      background-color: var(--color-gray-9);
    }
  }
`;

interface ToolCategoryProps {
  disabled?: boolean;
  banner: number;
  carousel: number;
  product: number;
  // eslint-disable-next-line no-unused-vars
  onAdd: (type: number) => void;
}

export default function ToolCategory(props: ToolCategoryProps) {
  const { langLabel, t } = useLanguage();

  return (
    <Wrapper disabled={props.disabled}>
      <div className='toolbar-category-title'>
        {langLabel.dashboard_theme_choose_decoration_line_1}
      </div>
      <div className='toolbar-category-caption'>
        {langLabel.dashboard_theme_choose_decoration_line_2}
      </div>

      <div className='toolbar-category-list'>
        <Tooltip
          title={langLabel.dashboard_theme_decoration_banner_carousel_tooltip}
          getPopupContainer={(triggerNode) => triggerNode}>
          <div
            className={'toolbar-category-item' + (props.carousel >= 5 ? ' --disabled' : '')}
            onClick={() => props.carousel < 10 && props.onAdd(2)}>
            <img
              src='/static/images/showroom/decoration/toolbar-category-image-carousel.jpg'
              alt=''
            />
            <p className='toolbar-category-item-name'>
              {t('dashboard_theme_decoration_banner_carousel_name', 'Carousel banners')} (
              {props.carousel}/5)
            </p>
          </div>
        </Tooltip>

        <Tooltip
          title={langLabel.dashboard_theme_decoration_image_banner_tooltip}
          getPopupContainer={(triggerNode) => triggerNode}>
          <div
            className={'toolbar-category-item' + (props.banner >= 10 ? ' --disabled' : '')}
            onClick={() => props.banner < 10 && props.onAdd(1)}>
            <img src='/static/images/showroom/decoration/toolbar-category-banner.jpg' alt='' />
            <p className='toolbar-category-item-name'>
              {t('dashboard_theme_decoration_image_banner_name', 'Image banner')} ({props.banner}
              /10)
            </p>
          </div>
        </Tooltip>

        <Tooltip
          title={langLabel.dashboard_theme_decoration_product_carousel_tooltip}
          getPopupContainer={(triggerNode) => triggerNode}>
          <div
            className={'toolbar-category-item' + (props.product >= 10 ? ' --disabled' : '')}
            onClick={() => props.product < 10 && props.onAdd(3)}>
            <img src='/static/images/showroom/decoration/toolbar-category-product.jpg' alt='' />
            <p className='toolbar-category-item-name'>
              {langLabel.dashboard_theme_decoration_product_carousel_title} ({props.product}/10)
            </p>
          </div>
        </Tooltip>
      </div>
    </Wrapper>
  );
}
