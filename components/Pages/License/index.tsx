import React, { useEffect } from 'react';

import styled from 'styled-components';
import { usePDF } from '@react-pdf/renderer';
import { Button } from 'antd';

import config from 'config';
import { changeToSlug } from 'common/functions';
import urlPage from 'constants/url.constant';

import MyImage from 'components/Fragments/Image';
import PDFComponent from './PDFComponent';
import Footer from './Footer';
import Header from './Header';

import { AssetModel } from 'models/asset.models';

import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

type Props = {
  data: AssetModel;
  image: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LicenseComponent = (props: Props) => {
  const productLink = urlPage.productDetail.replace(
    '{slug}',
    changeToSlug(props.data.title) + '--' + props.data.item_id
  );

  const listType: { title: string; info: string }[] = [
    { title: 'License Type', info: props.data.license.title },
    { title: 'Item Title', info: props.data.title },
    { title: 'Product ID', info: props.data.item_id },
    { title: 'Item Url', info: `${config.urlRoot}${productLink}` },
    { title: `Licensor`, info: props.data.marketUserByAuthorId.name ?? 'VRStyler' },
    { title: 'Licensee', info: props.data.market_user.name },
  ];

  const [instance] = usePDF({
    document: <PDFComponent listType={listType} imageBanner={props.image} />,
  });

  useEffect(() => {
    if (instance.url) props.setLoading(false);
  }, [instance, props]);

  return (
    <Wrapper className='position-relative'>
      <Container>
        <div className='shadow'>
          <div className='invoicePages' id='invoicePageOne'>
            <Header />

            <MainBanner>
              <MyImage fill src={props.image} alt='' />
            </MainBanner>

            <Table>
              {listType.map((item, index) => (
                <div className='item' key={index}>
                  <h3 className='left'>{item.title}</h3>
                  {item.title === 'Item Url' ? (
                    <div className='right right--link'>
                      <a href={item.info} target='_blank'>
                        {item.info}
                      </a>
                    </div>
                  ) : (
                    <p className='right'>{item.info}</p>
                  )}
                </div>
              ))}
            </Table>

            <p className='support'>
              For any queries related to this document or license please contact VRStyler Support
            </p>
            <a href='mailto:contact@vrstyler.com' className='link'>
              contact@vrstyler.com
            </a>

            <Footer />
          </div>
        </div>
      </Container>

      <div className='download__wrapper'>
        <Button type='primary' shape='round' loading={instance.loading}>
          <a href={instance.url ?? ''} download={`${props.data.title}-license.pdf`}>
            {instance.loading ? 'Creating PDF' : 'Download'}
          </a>
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .shadow {
    margin-top: 40px;
    box-shadow: 0 -2px 16px 0 rgba(0, 0, 0, 0.1);

    ${maxMedia.medium} {
      margin-top: 20px;
    }
  }

  .support,
  .link {
    padding: 0 20px;
  }

  .support {
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-gray-9);
    text-align: center;
  }

  .link {
    display: block;
    margin-bottom: 100px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-main-7);
    ${maxMedia.medium} {
      margin-bottom: 20px;
    }
  }

  .download__wrapper {
    text-align: center;
    padding: 30px 0;

    .ant-btn {
      width: 212px;
      height: 42px;
      font-weight: 600;
    }

    ${maxMedia.medium} {
      padding: 20px 0;
    }
  }
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
  }

  .left,
  .right {
    min-height: 60px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-weight: 500;
    font-size: 16px;
  }

  .item:not(:last-child) {
    margin-bottom: 10px;
  }

  .left {
    min-width: 200px;
    color: var(--color-gray-9);

    background-color: var(--color-gray-4);
    ${maxMedia.small} {
      width: 100px;
      min-width: unset;
    }
  }

  .right {
    flex: 1;
    background-color: var(--color-gray-5);
    color: var(--color-gray-11);
    word-break: break-word;

    &--link {
      display: block;
      line-height: 60px;
      color: #1890ff;
      white-space: nowrap;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const MainBanner = styled.div`
  position: relative;
  width: 400px;
  aspect-ratio: 4/3;
  margin: 30px auto;
  border-radius: 12px;

  img {
    object-fit: cover;
  }

  ${maxMedia.medium} {
    width: 264px;
    height: 264px;
  }
`;

export default LicenseComponent;
