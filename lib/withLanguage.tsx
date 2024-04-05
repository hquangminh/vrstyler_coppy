import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { UpdateLanguage } from 'store/reducer/web';

import { PageProps } from 'models/page.models';

const withLanguage = (BaseComponent: React.ComponentType<undefined | any>) => {
  const Component = (props: PageProps) => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      const { replace, pathname, asPath, query, locale } = router;
      if (props.language) {
        if (props.language.langCode !== locale)
          replace({ pathname, query }, asPath, { locale: props.language.langCode, shallow: true });
        dispatch(UpdateLanguage(props.language));
      }
    }, [dispatch, props.language, router]);

    return <BaseComponent {...props} />;
  };

  return Component;
};

export default withLanguage;
