import config from 'config';

type Props = { title: string; description: string; image: string };

const MetaTwitter = ({ title, description: descriptions, image }: Props) => {
  return (
    <>
      <meta property='twitter:card' content='summary' />
      <meta property='twitter:site' content={config.urlRoot} />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={descriptions} />
      <meta property='twitter:image' content={image} />
    </>
  );
};
export default MetaTwitter;
