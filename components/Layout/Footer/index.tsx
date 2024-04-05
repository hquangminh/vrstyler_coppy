import { CSSProperties, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';

import useLanguage from 'hooks/useLanguage';

import { AppState } from 'store/type';
import { SaveWebSettings } from 'store/reducer/web';

import commonServices from 'services/common-services';

import Icon from 'components/Fragments/Icons';
import SocialInBanner from 'components/Fragments/SocicalBanner';

import { ContainerSize } from 'models';

import { Container } from 'styles/__styles';
import * as SC from './style';
import Script from 'next/script';

const menus = (langLabel: Record<string, string>, langCode: string) => [
  {
    group: langLabel.company || 'Company',
    menuItems: [
      { title: langLabel.blog || 'Blog', url: `/${langCode}/blog/all` },
      {
        title: langLabel.career || 'Careers',
        url: `/${langCode}/blog/careers--d723af11-5d5b-4120-9356-e0810c1f4175`,
      },
      { title: langLabel.help_center, url: `/${langCode}/help-center` },
      { title: langLabel.contact || 'Contact Us', url: `/${langCode}/contact-us` },
    ],
  },
  {
    group: langLabel.footer_buy_model,
    menuItems: [
      {
        title: langLabel.footer_free_model,
        url: `/${langCode}/free-models/all`,
      },
      {
        title: langLabel.header_menu_best_selling,
        url: `/${langCode}/explore/all?sort=best-selling`,
      },
      {
        title: langLabel.header_menu_sale_off,
        url: `/${langCode}/sale-off/all`,
      },
      {
        title: langLabel.header_menu_modeling_service,
        url: `/${langCode}/modeling`,
      },
    ],
  },
  {
    group: langLabel.resource || 'Resources',
    menuItems: [
      { title: langLabel.footer_model_player, url: 'https://modelviewer.vrstyler.com' },
      // { title: 'Terms of Service', url: '/' },
      {
        title: langLabel.user_agreement,
        url: 'https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/user-agreement--f706b8f1-0bcb-4a23-af40-e8290fd7f3ba',
      },
      {
        title: langLabel.privacy_policy || 'Privacy Policy',
        url: 'https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/privacy-policy--4bc287f7-3fea-4b20-ad96-d64ed3f32780',
      },
    ],
  },
];

type Props = {
  style?: CSSProperties;
  containerSize?: ContainerSize;
};

const Footer = ({ style, containerSize = 'large' }: Props) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: AppState) => state.web.setting);
  const { langCode, langLabel } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { error, data } = await commonServices.webSettings();
        if (!error) dispatch(SaveWebSettings(data));
      } catch (error) {}
    };

    if (!settings) fetchSettings();
  }, [dispatch, settings]);

  return (
    <SC.Footer_Wrapper style={style}>
      <Container size={containerSize}>
        <SC.FooterContent>
          <SC.MenuSection>
            {menus(langLabel, langCode).map((menu, index) => {
              return (
                <SC.MenuGroup key={index}>
                  <h2>{menu.group}</h2>

                  {menu.menuItems.map((menu_item, index2) => {
                    return (
                      <SC.MenuItem key={index + '-' + index2}>
                        <Link href={menu_item.url}>{menu_item.title}</Link>
                      </SC.MenuItem>
                    );
                  })}
                </SC.MenuGroup>
              );
            })}
          </SC.MenuSection>

          <SC.Social>
            <div className='logo'>
              <Link href='/' legacyBehavior>
                <a aria-label='Logo'>
                  <Icon iconName='logo-white' />
                </a>
              </Link>
            </div>
            <SocialInBanner size='large' color='var(--color-gray-1)' />
            <SC.Certify>
              <li>
                <a
                  href='//www.dmca.com/Protection/Status.aspx?ID=03ed3aab-948c-4972-ba89-d876ca736afe'
                  target='__blank'
                  title='DMCA.com Protection Status'>
                  <img
                    src='https://images.dmca.com/Badges/dmca-badge-w100-5x1-01.png?ID=03ed3aab-948c-4972-ba89-d876ca736afe'
                    alt='DMCA.com Protection Status'
                  />
                </a>
                <Script src='https://images.dmca.com/Badges/DMCABadgeHelper.min.js' />
              </li>
            </SC.Certify>
          </SC.Social>
        </SC.FooterContent>
      </Container>
    </SC.Footer_Wrapper>
  );
};

export default Footer;
