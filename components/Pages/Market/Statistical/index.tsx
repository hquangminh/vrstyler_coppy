import CountUp from 'react-countup';

import { Container } from 'styles/__styles';
import * as SC from './style';

type Props = {
  download: string | number;
  transaction: string | number;
  rate: string | number;
};

const Statistical = ({ download, transaction, rate }: Props) => {
  const convert = (value: number) => {
    let result: [number, string] = [value, ''];
    if (value >= 1000000) return (result = [value / 1000000, 'M']);
    if (value >= 1000) return (result = [value / 1000, 'K']);
    return result;
  };

  return (
    <SC.Wrapper>
      <Container className='box'>
        <SC.List>
          <SC.Item>
            <p className='total'>
              +<CountUp end={convert(Number(download))[0]} enableScrollSpy />
              {convert(Number(download))[1]}
            </p>
            <p className='label'>
              <img src='/static/images/market/icon-download.png' alt='' /> Download
            </p>
          </SC.Item>

          <SC.Item>
            <p className='total'>
              +<CountUp end={convert(Number(transaction))[0]} enableScrollSpy />
              {convert(Number(transaction))[1]}
            </p>
            <p className='label'>
              <img src='/static/images/market/icon-checkmark.png' alt='' /> Transaction
            </p>
          </SC.Item>

          <SC.Item>
            <p className='total'>
              +<CountUp end={convert(Number(rate))[0]} enableScrollSpy />
              {convert(Number(rate))[1]}
            </p>
            <p className='label'>
              <img src='/static/images/market/icon-star.png' alt='' /> Rattings
            </p>
          </SC.Item>
        </SC.List>
      </Container>
    </SC.Wrapper>
  );
};

export default Statistical;
