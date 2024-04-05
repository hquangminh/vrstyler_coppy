import styled from 'styled-components';

import useLanguage from 'hooks/useLanguage';
import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';
import InfoContact from './InfoContact';

const ContactUs = () => {
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <Container className='ContactUs__Box'>
        <section className='ContactUs__Title'>
          <h1>{langLabel.contact || 'Contact'} 👋</h1>
        </section>

        <InfoContact />
      </Container>
    </Wrapper>
  );
};
export default ContactUs;

const Wrapper = styled.main`
  min-height: calc(100vh - 60px);
  padding-top: 204px;

  background-color: var(--color-main-1);
  background-image: url('/static/images/contact-us/background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;

  ${maxMedia.medium} {
    padding-top: 30px;
  }

  .ContactUs__Box {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;

    ${maxMedia.medium} {
      display: block;
    }
  }

  .ContactUs__Title {
    ${maxMedia.medium} {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 4.8rem;
      font-weight: 600;
      color: var(--text-title);

      ${maxMedia.medium} {
        width: fit-content;
        margin: 0 auto;
        text-align: left;
      }

      ${maxMedia.small} {
        width: unset;
        font-size: 24px;
        text-align: left;
      }
    }
  }
`;
