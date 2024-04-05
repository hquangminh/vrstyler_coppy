import ProductListComponent from './ProductList';
import DecorationBanner from 'components/Pages/Dashboard/Showroom/Decoration/Fragments/Banner';
import DecorationImageCarousel from 'components/Pages/Dashboard/Showroom/Decoration/Fragments/ImageCarousel';

import { ShowroomDetailType } from 'models/showroom.models';

type Props = { data?: ShowroomDetailType[] };

export const ViewComponent = (props: Props) => {
  return (
    <>
      {props.data?.map((item) => {
        if (item.type === 1)
          return <DecorationBanner key={item.id} image={item.image} onDelete={() => undefined} />;
        if (item.type === 2)
          return (
            <DecorationImageCarousel
              key={item.id}
              aspect={item.carousel_aspect}
              images={item.market_showroom_section_images?.map((i) => i.image)}
              onDelete={() => undefined}
            />
          );
        if (item.type === 3) return <ProductListComponent key={item.id} product={item} />;
      })}
    </>
  );
};

export default ViewComponent;
