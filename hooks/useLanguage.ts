import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { setCookieLangCode } from 'lib/utils/language';
import { getLanguage, MovePageStart } from 'store/reducer/web';
import { CloseMenuAvatar } from 'store/reducer/modal';

import i18nEnglish from 'i18n/language/English.json';
import i18nJapanese from 'i18n/language/Japanese.json';
import i18nKorean from 'i18n/language/Korean.json';
import i18nVietnamese from 'i18n/language/Vietnamese.json';

const langLabelEnglish: Record<string, string> = i18nEnglish;

const useLanguage = () => {
  const dispatch = useDispatch();
  const { pathname, replace, query, locale } = useRouter();
  const { langCode = locale !== 'detect' ? locale : 'en', languages } = useSelector(getLanguage);

  const langLabel: Record<string, string> = useMemo(() => {
    switch (langCode) {
      case 'kr':
        return i18nKorean;
      case 'jp':
        return i18nJapanese;
      case 'vn':
        return i18nVietnamese;
      default:
        return i18nEnglish;
    }
  }, [langCode]);

  const handleChangeLanguage = (lang: string) => {
    if (lang !== langCode) {
      dispatch(MovePageStart());
      setCookieLangCode(lang);
      handleChangeUrl(lang);
    }
    dispatch(CloseMenuAvatar());
  };

  const handleChangeUrl = (lang: string) => {
    replace({ pathname, query }, undefined, { scroll: false, shallow: false, locale: lang });
  };

  const t = (key: string, default_value?: string) =>
    langLabel[key] ?? default_value ?? 'i18n not found';

  return {
    languages,
    langCode: langCode ?? 'en',
    langLabel: { ...langLabelEnglish, ...langLabel },
    t,
    handleChangeLanguage,
  };
};

export default useLanguage;
