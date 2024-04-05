import { ThemeConfig } from 'antd';
import { pretendard } from '@/fonts';

const themeDefault: ThemeConfig = {
  token: {
    colorPrimary: '#369ca5',
    fontFamily: `${pretendard.style.fontFamily}, var(--font-family-sans-serif)`,
  },
};

export default themeDefault;
