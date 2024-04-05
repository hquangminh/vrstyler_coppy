import axios from 'axios';
import Cookies, { CookieSetOptions } from 'universal-cookie';

import config from 'config';
import commonServices from 'services/common-services';

import { Language, LanguageType } from 'models/page.models';
import { GetServerSidePropsContext } from 'next';

export const DetectLanguage = async (ctx: GetServerSidePropsContext): Promise<Language> => {
  const { req, locale } = ctx;

  let langCode: string | null;

  const { data: languages } = await commonServices.languages();
  const languageCodes: string[] = languages?.map((i: LanguageType) => i.language_code);
  const languageDefault = languages?.find((i: LanguageType) => i.is_default)?.language_code ?? 'en';

  try {
    const acceptLanguage = req.headers['accept-language'];
    const firstLangAccept = acceptLanguage?.split(',')[0];
    let codeCountryAccept = (firstLangAccept?.split('-')[1] ?? firstLangAccept)?.toLowerCase();

    if (codeCountryAccept === 'us') codeCountryAccept = 'en';
    else if (codeCountryAccept === 'ja') codeCountryAccept = 'jp';
    else if (codeCountryAccept === 'ko') codeCountryAccept = 'kr';
    else if (codeCountryAccept === 'vi') codeCountryAccept = 'vn';

    if (locale && languageCodes.includes(locale)) langCode = locale;
    else if (codeCountryAccept && languageCodes.includes(codeCountryAccept))
      langCode = codeCountryAccept;
    else langCode = req.cookies.langCode ?? null;

    if (!langCode)
      langCode = await axios
        .get(`https://hutils.loxal.net/whois`)
        .then((response) => response.data.countryIso.toLowerCase());
  } catch (error) {
    langCode = languageDefault;
  }

  if (!langCode || !languageCodes.some((i) => i === langCode?.toLowerCase())) langCode = 'en';

  return { languages, langCode };
};

export const setCookieLangCode = (langCode: string) => {
  const cookies = new Cookies();

  const options: CookieSetOptions = { domain: config.domain, path: '/' };
  cookies.set('langCode', langCode, options);
};
