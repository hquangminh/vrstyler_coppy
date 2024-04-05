export const maxMediaQuery = (px: number) => `@media (max-width: ${px}px)`;
export const maxMedia = {
  /** @media (max-width: 991px) */
  medium: maxMediaQuery(991),

  /** @media (max-width: 640px) */
  small: maxMediaQuery(640),

  /** @media (max-width: 480px) */
  xsmall: maxMediaQuery(480),

  /** @media (max-width: 360px) */
  tiny: maxMediaQuery(360),

  /** @media (max-width: ${param}px) */
  custom: maxMediaQuery,
};

export const minMediaQuery = (px: number) => `@media (min-width: ${px}px)`;
export const minMedia = {
  medium: minMediaQuery(992),

  /** @media (min-width: 640px) */
  small: minMediaQuery(640),

  /** @media (min-width: 480px) */
  xsmall: minMediaQuery(480),

  /** @media (min-width: 360px) */
  tiny: minMediaQuery(360),

  /** @media (min-width: ${param}px) */
  custom: minMediaQuery,
};

export const ChangeRemMobileToPC = (
  device: 'medium' | 'small' | 'xsmall' | 'tiny',
  rem: number
) => {
  const pixelDefault = 10;
  switch (device) {
    case 'medium':
      return rem * (pixelDefault / 8.5) + 'rem';
    case 'small':
      return rem * (pixelDefault / 8) + 'rem';
    case 'xsmall':
      return rem * (pixelDefault / 7) + 'rem';
    case 'tiny':
      return rem * (pixelDefault / 6) + 'rem';
    default:
      return rem + 'rem';
  }
};
