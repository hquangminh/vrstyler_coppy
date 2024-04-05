import Image from 'next/image';

import useLanguage from 'hooks/useLanguage';

import HeaderSection from './Fragments/HeaderSection';

import styled from 'styled-components';
import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';

const ExperiencePlaces = () => {
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <Container>
        <HeaderSection
          title={langLabel.homepage_experience_place_title}
          caption={langLabel.homepage_experience_place_caption}
        />

        <List>
          <Item>
            <Image
              src='/static/images/market/experience-places-01.svg'
              alt={langLabel.homepage_experience_place_device}
              width={84}
              height={84}
            />
            <p>{langLabel.homepage_experience_place_device}</p>
          </Item>
          <Item>
            <Image
              src='/static/images/market/experience-places-02.svg'
              alt={langLabel.homepage_experience_place_player}
              width={84}
              height={84}
            />
            <p>{langLabel.homepage_experience_place_player}</p>
          </Item>
          <Item>
            <Image
              src='/static/images/market/experience-places-03.svg'
              alt={langLabel.homepage_experience_place_ar}
              width={84}
              height={84}
            />
            <p>{langLabel.homepage_experience_place_ar}</p>
          </Item>
        </List>
      </Container>
    </Wrapper>
  );
};
export default ExperiencePlaces;

const Wrapper = styled.section`
  padding: 100px 0;
  background-color: var(--color-primary-25);

  ${maxMedia.small} {
    padding: 50px 0;
  }
`;
const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 40px;
  padding: 0 40px;
  gap: 40px;

  ${maxMedia.small} {
    grid-template-columns: 100%;
    padding: 0;
  }
`;
const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;

  img {
    width: 84px;

    ${maxMedia.small} {
      width: 80px;
    }
  }

  p {
    width: calc(100% - 99px);
    font-size: 16px;
    font-weight: 400;
    color: var(--text-caption);

    ${maxMedia.small} {
      width: calc(100% - 95px);
    }
  }
`;
