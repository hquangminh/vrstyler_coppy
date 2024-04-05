import { NextRouter } from 'next/router';

export default function cancelLoadingPage(
  currentPage: string,
  nextPage: string,
  router: NextRouter
) {
  const isSameStartsWith = (path: string) =>
    currentPage.startsWith(path) && nextPage.startsWith(path);

  return (
    currentPage === nextPage ||
    currentPage === '/login' ||
    isSameStartsWith('/explore') ||
    isSameStartsWith('/free-model') ||
    isSameStartsWith('/sale-off') ||
    isSameStartsWith('/user') ||
    isSameStartsWith(`/showroom/${router.query.nickName}/products`) ||
    isSameStartsWith('/seller') ||
    isSameStartsWith('/showroom/dashboard') ||
    isSameStartsWith('/modeling/orders') ||
    (isSameStartsWith('/blog') &&
      currentPage.split('/').length <= 3 &&
      nextPage.split('/').length <= 3)
  );
}
