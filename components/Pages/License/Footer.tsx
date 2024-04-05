import styled from 'styled-components';

const Footer = () => {
  return (
    <Footer_wrapepr>
      <h3>VRStyler</h3>
      <p>
        179 Tran Hung Dao street, Floor 1, Vietnam Innovation Hub Building, Danang city, Vietnam
      </p>
    </Footer_wrapepr>
  );
};

const Footer_wrapepr = styled.div`
  padding: 30px 0;
  background-color: var(--color-gray-4);
  text-align: center;

  h3 {
    margin-bottom: 10px;
    font-weight: 600;
    color: var(--color-gray-11);
    font-size: 24px;
  }

  p {
    font-size: 16px;
    letter-spacing: 0.64px;
    color: var(--color-gray-9);
  }

  p,
  h3 {
    padding: 0 20px;
  }
`;

export default Footer;
