import checkAuthServerSide from 'lib/checkAuthServerSide';
import urlPage from 'constants/url.constant';

export default function Index() {
  return null;
}

export const getServerSideProps = checkAuthServerSide(async (content) => {
  return { redirect: { destination: urlPage.my_order, permanent: false } };
});
