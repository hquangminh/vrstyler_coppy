import type { DocumentContext, DocumentInitialProps } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const cache = createCache();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(
              <StyleProvider cache={cache}>
                <App {...props} />
              </StyleProvider>
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            <script
              dangerouslySetInnerHTML={{ __html: `</script>${extractStyle(cache)}<script>` }}
            />
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const isProduction = this.props.__NEXT_DATA__.runtimeConfig?.DEPLOY_ENV === 'prod';
    let langCode = this.props.__NEXT_DATA__.props.pageProps?.language?.langCode;
    if (langCode === 'kr') langCode = 'ko';
    else if (langCode === 'jp') langCode = 'ja';
    else if (langCode === 'vn') langCode = 'vi';

    return (
      <Html lang={langCode ?? 'en'} dir='ltr' translate='no'>
        <Head>
          <noscript id='jss-insertion-point' />
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, user-scalable=no'
          />
          <meta httpEquiv='Cache-Control' content='cache, store, must-revalidate' />
          <meta httpEquiv='Pragma' content='no-cache' />
          <meta httpEquiv='Expires' content='0' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='resource-type' content='document' />
          <meta name='distribution' content='global' />
          <meta name='robots' content={isProduction ? 'index,follow' : 'noindex,nofollow'} />
          <meta name='googlebot' content={isProduction ? 'index,follow' : 'noindex,nofollow'} />
          <meta name='revisit-after' content='1 days' />
          <meta name='rating' content='general' />
          <meta name='google' content='notranslate' />
          <link rel='shortcut icon' type='image/png' href='/static/favicon.png' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            id='website-name'
            type='application/ld+json'
            strategy='beforeInteractive'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'Organization',
                name: 'VRStyler',
                url: 'https://vrstyler.com/',
              }),
            }}
          />
        </body>
      </Html>
    );
  }
}
