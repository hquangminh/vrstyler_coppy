import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import urlPage from 'constants/url.constant';
import useLanguage from 'hooks/useLanguage';

import Icon from 'components/Fragments/Icons';

import { AppState } from 'store/type';
import { SaveWebSettings } from 'store/reducer/web';
import commonServices from 'services/common-services';

import { Container } from 'styles/__styles';
import { maxMedia } from 'styles/__media';
import styled from 'styled-components';

const Wrapper = styled.footer`
  padding: 28px 0;
  background-color: #fefefe;
  border-top: var(--border-1px);

  .footer-sample-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--color-gray-8);

    ul {
      a {
        color: var(--color-gray-8);
      }
    }

    .footer__list {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      ${maxMedia.xsmall} {
        gap: 8px;
      }
      .footer__right {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        gap: 8px;
        ${maxMedia.xsmall} {
          flex-direction: column;
          align-items: center;
        }
      }
      ${maxMedia.small} {
        flex-direction: column;
      }
    }
    ${maxMedia.small} {
      .footer__divider {
        margin: 0 8px;
        position: relative;
      }
      .footer__divider::before {
        content: '|';
        color: #7f7f8d;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        ${maxMedia.xsmall} {
          display: none;
        }
      }
    }

    .footer__icons {
      display: flex;
      align-items: center;
      gap: 12px;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid #7f7f8d;
      }
    }

    ${maxMedia.medium} {
      flex-direction: column;
      gap: 20px;
    }
  }
`;

type Props = {
  blog?: boolean;
  help?: boolean;
};

const FooterSample = (props: Props) => {
  const { blog = true, help = true } = props;
  const { langLabel } = useLanguage();

  const dispatch = useDispatch();
  const settings = useSelector((state: AppState) => state.web.setting);

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
    <Wrapper>
      <Container>
        <div className='footer-sample-content'>
          <ul className='footer__list'>
            <div className='footer__left'>© 2023 VRStyler</div>
            <div className='footer__right'>
              <li>
                <Link href='https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/user-agreement--f706b8f1-0bcb-4a23-af40-e8290fd7f3ba'>
                  {langLabel.user_agreement}
                </Link>
              </li>
              <div className='footer__divider'></div>

              {blog && (
                <li>
                  <Link href={urlPage.blog}>{langLabel.blog || 'Blog'}</Link>
                </li>
              )}

              {help && (
                <>
                  <li>
                    <Link href='https://vrstyler.com/help-center/privacy-legal--2ad9ed3e-e784-4e1b-8f9a-12f26a3a1367/privacy-policy--4bc287f7-3fea-4b20-ad96-d64ed3f32780'>
                      {langLabel.privacy_policy}
                    </Link>
                  </li>
                  <div className='footer__divider'></div>

                  <li>
                    <Link href={urlPage.contact_us}>{langLabel.contact || 'Contact'}</Link>
                  </li>
                </>
              )}
            </div>
          </ul>

          <ul className='footer__icons'>
            {settings?.facebook && (
              <li>
                <a href={settings.facebook} target='__blank'>
                  <Icon iconName='facebook' />
                </a>
              </li>
            )}
            {settings?.behance && (
              <li>
                <a href={settings.behance} target='__blank'>
                  <Icon iconName='behance' />
                </a>
              </li>
            )}
            {settings?.pinterest && (
              <li>
                <a href={settings.pinterest} target='__blank'>
                  <Icon iconName='pinterest' />
                </a>
              </li>
            )}
            {settings?.artstation && (
              <li>
                <a href={settings.artstation} target='__blank'>
                  <Icon iconName='artstation' />
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>
    </Wrapper>
  );
};
export default FooterSample;
