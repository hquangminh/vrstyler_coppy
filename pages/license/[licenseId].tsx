import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import config from 'config';

import withLanguage from 'lib/withLanguage';
import withLayout from 'lib/withLayout';
import checkAuthServerSide from 'lib/checkAuthServerSide';
import { DetectLanguage } from 'lib/utils/language';

import { handlerMessage } from 'common/functions';
import getBase64Image from 'common/functions/getBase64Image';
import resizeImage from 'common/functions/resizeImageBase64';
import urlPage from 'constants/url.constant';
import licenseServices from 'services/license-services';

import { AssetModel } from 'models/asset.models';
import { UserType } from 'models/user.models';
import { PageProps } from 'models/page.models';

const LicenseComponent = dynamic(() => import('components/Pages/License'), { ssr: false });

type Props = PageProps & { data: AssetModel };

const Index = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<string>();

  const convertImage = useCallback(async () => {
    getBase64Image(props.data.image, async (base64) => {
      const base64PNG = base64.replace(`image/${props.data.image.split('.').at(-1)}`, 'image/png');
      const imgResize = await resizeImage(base64PNG, 360);
      setImage(imgResize);
    });
  }, [props.data.image]);

  useEffect(() => {
    convertImage();
  }, [convertImage]);

  useEffect(() => {
    if (!props.data) {
      handlerMessage('Not found license', 'error');
      router.replace(urlPage.my_model);
    } else setLoading(false);
  }, [props.data, router]);

  const title = `License Certificate | ${config.websiteName}`;

  if (!image || loading) return null;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            height: '100vh',
          }}>
          <Spin />
        </div>
      )}
      <LicenseComponent data={props.data} setLoading={setLoading} image={image} />
    </>
  );
};

export const getServerSideProps = checkAuthServerSide(
  async (content) => {
    try {
      const licenseId = content.query.licenseId?.toString().split('--')[1] ?? '';
      const fetchLanguage = DetectLanguage(content);
      const fetchLicense = licenseServices.download(licenseId, content.req.cookies.token);

      const props: Props = await Promise.all([fetchLanguage, fetchLicense]).then(
        ([language, { data }]) => ({ language, data })
      );

      return { props };
    } catch (error) {
      return { notFound: true };
    }
  },
  { userAllow: [UserType.CUSTOMER, UserType.SELLER] }
);

export default withLanguage(
  withLayout(Index, { header: { show: false }, footer: { show: false } })
);
