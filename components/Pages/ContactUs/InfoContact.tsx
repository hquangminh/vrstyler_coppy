import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';

const InfoContact = () => {
  const { langLabel } = useLanguage();

  return (
    <Wrapper>
      <h4>{langLabel.contact_us_address}</h4>
      <p dangerouslySetInnerHTML={{ __html: langLabel.contact_us_location }} />
      <h4>{langLabel.contact_us_customer_support}</h4>
      <p>
        <a href='mailto:contact@vrstyler.com'>contact@vrstyler.com</a>
      </p>
      <span>{langLabel.contact_us_note}</span>
    </Wrapper>
  );
};
export default InfoContact;

const Wrapper = styled.section`
  h4 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-title);
  }
  h4 + p {
    font-size: 16px;
    color: var(--text-caption);
  }
  h4 ~ h4 {
    margin-top: 30px;
  }
  span {
    display: inline-block;
    max-width: 430px;
    margin-top: 10px;
    font-size: 14px;
    color: var(--text-caption);
  }
`;
