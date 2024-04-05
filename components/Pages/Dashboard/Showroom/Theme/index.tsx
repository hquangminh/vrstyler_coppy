import { useEffect, useState } from 'react';
import { Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import showroomServices from 'services/showroom-services';

import ShowroomThemeCard from './ThemeCard';

import { ShowroomThemeModel } from 'models/showroom.models';

import styled from 'styled-components';

const ShowroomTheme_Wrap = styled.div`
  margin-top: 24px;
  .Showroom_Theme__List {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
  }
  .theme_title {
    font-size: 32px;
    font-weight: 400;
    text-align: center;
    padding-bottom: 40px;
  }
`;

export default function ShowroomTheme() {
  const { langLabel } = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  const [themes, setThemes] = useState<ShowroomThemeModel[]>([]);

  useEffect(() => {
    onFetchTheme();
  }, []);

  const onFetchTheme = async () => {
    await showroomServices.getTheme().then(({ data }) => {
      setThemes(data);
      setLoading(false);
    });
  };

  return (
    <ShowroomTheme_Wrap>
      <Spin spinning={loading}>
        <h1 className='theme_title'>{langLabel.dashboard_theme_title}</h1>
        <div className='Showroom_Theme__List'>
          {themes.map((item) => (
            <ShowroomThemeCard key={item.id} data={item} setThemes={setThemes} />
          ))}
          {!loading && themes.length < 5 && (
            <ShowroomThemeCard
              setThemes={setThemes}
              themeNameDefault={langLabel.dashboard_theme_default_name}
            />
          )}
        </div>
      </Spin>
    </ShowroomTheme_Wrap>
  );
}
