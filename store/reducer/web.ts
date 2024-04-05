import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, AppStateWeb, WebsiteSettingsModel } from 'store/type';
import { BannerModel } from 'models/banner.models';
import { CategoryModel } from 'models/category.models';

import i18nEnglish from 'i18n/language/English.json';
import { Language } from 'models/page.models';

const initialState: AppStateWeb = {
  movingPage: false,
  notificationTotal: 0,
};

export const slice = createSlice({
  name: 'webRedux',
  initialState,
  reducers: {
    //Settings
    SaveWebSettings: (state, action: PayloadAction<WebsiteSettingsModel>) => {
      state.setting = action.payload;
    },
    UpdateLanguage: (state, action: PayloadAction<Language>) => {
      state.languages = action.payload.languages;
      state.langCode = action.payload.langCode || 'en';
      state.langLabel = action.payload.langLabel || i18nEnglish;
    },
    SaveCategory: (state, action: PayloadAction<CategoryModel[]>) => {
      state.categories = action.payload;
    },
    SaveBanner: (state, action: PayloadAction<BannerModel>) => {
      state.banner = action.payload;
    },
    MovePageStart: (state) => {
      state.movingPage = true;
    },
    MovePageEnd: (state) => {
      state.movingPage = false;
    },
    ShowNotificationBar: (state) => {
      state.notificationBar = true;
    },
    HideNotificationBar: (state) => {
      state.notificationBar = false;
    },
    UpdateNotification: (
      state,
      action: PayloadAction<{ type: 'set' | 'down' | 'reset'; count?: number }>
    ) => {
      switch (action.payload.type) {
        case 'set':
          state.notificationTotal = action.payload.count;
          break;
        case 'reset':
          state.notificationTotal = 0;
          break;
        case 'down':
          state.notificationTotal = (state.notificationTotal || 1) - 1;
          break;
        default:
          break;
      }
    },
    OpenShare: (state, action: PayloadAction<{ link: string }>) => {
      state.share = { link: action.payload.link };
    },
    CloseShare: (state) => {
      state.share = { link: '' };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  SaveWebSettings,
  UpdateLanguage,
  SaveCategory,
  SaveBanner,
  MovePageStart,
  MovePageEnd,
  ShowNotificationBar,
  HideNotificationBar,
  UpdateNotification,
  OpenShare,
  CloseShare,
} = slice.actions;

export const detectShareVisible = (state: AppState) =>
  state.web.share && state.web.share.link.length > 0;

export const selectInfoShare = (state: AppState) => state.web.share;
export const checkMovingPage = (state: AppState) => state.web.movingPage;

export const getLanguage = createSelector(
  (state: AppState) => state,
  ({ web }) => ({ languages: web.languages, langCode: web.langCode, langLabel: web.langLabel })
);

export const notificationUnread = (state: AppState) => state.web.notificationTotal;

export default slice.reducer;
