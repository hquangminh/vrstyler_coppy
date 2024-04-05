import config from 'config';
import LanguageSupport from 'i18n/LanguageSupport';

export const tagLinkHrefLang = (asPath: string) => {
  const asPathNoQuery = asPath.split('?')[0];
  const query = asPath.split('?')[1];
  let pathname = '';

  if (LanguageSupport.some((i) => asPath.slice(1).includes(i)))
    pathname = asPathNoQuery.split('/').slice(2).join('/') + (query ? '?' + query : '');
  else pathname = asPath;

  return (
    <>
      <link rel='alternate' href={config.urlRoot + pathname} hrefLang='x-default' />
      <link rel='alternate' href={config.urlRoot + `/en` + pathname} hrefLang='en-us' />
      <link rel='alternate' href={config.urlRoot + `/kr` + pathname} hrefLang='ko-kr' />
      <link rel='alternate' href={config.urlRoot + `/jp` + pathname} hrefLang='ja-jp' />
    </>
  );
};
