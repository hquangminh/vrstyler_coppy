import config from 'config';

type Props = { title: string; description: string; image: string; keywords?: string };

const MetaFacebook = ({ title, description, image, keywords }: Props) => {
  return (
    <>
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={config.urlRoot} />
      <meta property='og:image' content={image} />
      <meta property='keywords' content={keywords} />
    </>
  );
};
export default MetaFacebook;
