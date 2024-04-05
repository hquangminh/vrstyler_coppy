import React from 'react';
import Link from 'next/link';
import ReactHtmlParser, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from 'html-react-parser';
import config from 'config';

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode instanceof Element) {
      if (domNode.name === 'a' && domNode.attribs.href.startsWith('/')) {
        return (
          <Link {...attributesToProps(domNode.attribs)} href={domNode.attribs.href}>
            {domToReact(domNode.children as DOMNode[], options)}
          </Link>
        );
      }

      if (domNode.name === 'a' && domNode.attribs.href.startsWith(config.urlRoot)) {
        const link = domNode.attribs.href.split(config.urlRoot).join('');
        return (
          <Link {...attributesToProps(domNode.attribs)} href={link}>
            {domToReact(domNode.children as DOMNode[], options)}
          </Link>
        );
      }
    }
  },
};

export default function HtmlComponent({ html }: Readonly<{ html: string }>) {
  return ReactHtmlParser(html, options);
}
