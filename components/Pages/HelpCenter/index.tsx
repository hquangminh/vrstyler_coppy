import { useEffect, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import { Spin } from 'antd';

import helpCenterServices from 'services/helpCenter-services';
import isArrayEmpty from 'common/functions/isArrayEmpty';

import HelpCenterBanner from './Banner';
import HelpCollectionCard from './CollectionCard';

import { HelpCategory } from 'models/help.models';
import ResultEmpty from 'components/Fragments/ResultEmpty';

import styled from 'styled-components';
import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const HelpCenterComponent = () => {
  const [helpCollection, setHelpCollection] = useState<HelpCategory[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    helpCenterServices
      .getCollection()
      .then((res) => {
        setHelpCollection(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const { langLabel } = useLanguage();

  return (
    <HelpCenter__Wrapper>
      <HelpCenterBanner />

      <HelpCenter__Collection>
        <Container>
          {isLoading ? (
            <Spin spinning={isLoading} className='spin' />
          ) : (
            <>
              {!helpCollection || isArrayEmpty(helpCollection) ? (
                <ResultEmpty description={langLabel.help_center_empty_title} />
              ) : (
                <div className='help-center-list-collection'>
                  {helpCollection.map((collection) => (
                    <HelpCollectionCard key={collection.id} data={collection} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </HelpCenter__Collection>
    </HelpCenter__Wrapper>
  );
};
export default HelpCenterComponent;

const HelpCenter__Wrapper = styled.main`
  padding: 50px 0;
  min-height: 100vh;
  ${maxMedia.small} {
    padding: 20px 0;
  }
`;
const HelpCenter__Collection = styled.section`
  margin-top: 76px;

  ${maxMedia.small} {
    margin-top: 48px;
  }
  .spin {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .help-center-list-collection {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 30px;

    ${maxMedia.medium} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${maxMedia.small} {
      grid-template-columns: 100%;
    }
  }
`;
