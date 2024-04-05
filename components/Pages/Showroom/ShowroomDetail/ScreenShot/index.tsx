import ProductCard from 'components/Fragments/ProductCard';

import { ShowroomDetailType } from 'models/showroom.models';

import * as L from './style';

type Props = { data?: ShowroomDetailType[] };

export const ScreenShot = (props: Props) => {
  return (
    <L.ScreenShot_wrapper>
      {props.data?.map((item) => {
        if (item.type === 1) return <img src={item.image} key={item.id} alt='' />;
        if (
          item.type === 2 &&
          item.market_showroom_section_images &&
          item.market_showroom_section_images?.length > 0
        )
          return (
            <div className='position-relative' key={item.id}>
              <img
                src={item.market_showroom_section_images[0].image}
                style={{
                  aspectRatio: item.carousel_aspect ? item.carousel_aspect + '' : 'auto',
                }}
                alt=''
              />
              <ul className='dots__fake'>
                {item.market_showroom_section_images.map((_, index) => (
                  <li className={`dot ${index === 0 ? 'active' : ''}`} key={index} />
                ))}
              </ul>
            </div>
          );

        if (item.type === 3) {
          const renderProductHtml = [];
          if (
            item.market_showroom_section_products &&
            item.market_showroom_section_products.length > 0
          ) {
            for (let i = 0; i < 4; i++) {
              renderProductHtml.push(item.market_showroom_section_products[i].market_item);
            }
          }

          return (
            <div className='product__lists' key={item.id}>
              {item.name && <h3 className='title'>{item.name}</h3>}

              <div className='inner'>
                {renderProductHtml.map((product) => (
                  <ProductCard data={product} key={product.id} />
                ))}
              </div>
            </div>
          );
        }
      })}
    </L.ScreenShot_wrapper>
  );
};

export default ScreenShot;
