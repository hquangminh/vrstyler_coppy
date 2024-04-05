import Head from 'next/head';
import styled from 'styled-components';
import { maxMedia } from 'styles/__media';

type Props = { html: string };
const RenderHtmlEditor = ({ html }: Props) => {
  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/jodit/3.20.3/jodit.es2018.min.css'
        />
      </Head>

      <Wrapper
        className='jodit-wysiwyg'
        dangerouslySetInnerHTML={{ __html: html + '<p style="clear: both; display: block" />' }}
      />
    </>
  );
};
export default RenderHtmlEditor;

const Wrapper = styled.div`
  font-size: 16px;
  word-break: break-word;
  ${maxMedia.medium} {
    font-size: 14px;
  }

  * {
    max-width: 100%;
  }
  h1 {
    font-size: 2em;
    font-weight: bolder;
  }
  h2 {
    font-size: 1.5em;
    font-weight: bolder;
  }
  h3 {
    font-size: 1.17em;
    font-weight: bolder;
  }
  h4 {
    font-size: 1em;
    font-weight: bolder;
  }
  h5 {
    font-size: 0.83em;
    font-weight: bolder;
  }
  h6 {
    font-size: 0.67em;
    font-weight: bolder;
  }
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  ul {
    padding: 0 20px 10px;
  }
  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  em {
    font-style: italic;
  }
  blockquote {
    background-color: var(--color-primary-25);
    border-left: 5px solid var(--color-primary-100);
    border-radius: 5px;
    /* box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05), 0px 15px 20px -1px rgba(0, 0, 0, 0.025); */
    margin: 0;
    margin-bottom: 1em;
    padding: 0.8em;
  }
  iframe[src^="https://www.youtube.com/"]
  {
    max-width: 100%;
    height: unset;
    aspect-ratio: 16 / 9;
  }
  img {
    height: auto !important;
  }
  figure {
    text-align: center;
    img {
      margin-bottom: 0px;
    }
    figcaption {
      margin-top: 2px;
      font-size: 14px;
      font-weight: 400;
      color: #999;
    }
    &.image.align-left {
      float: left;
      & + * {
        clear: both;
      }
    }
    &.image.align-right {
      float: right;
      clear: both;
      & + * {
        clear: both;
      }
    }
  }
`;
