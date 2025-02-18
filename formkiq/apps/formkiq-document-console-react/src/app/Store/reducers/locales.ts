import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import { Locale, RequestStatus } from '../../helpers/types/locales';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

interface LocalesState {
  locales: Locale[];
  localesLoadingStatus: keyof typeof RequestStatus;
  nextLocalesToken: string | null;
  currentLocalesSearchPage: number;
  isLastLocalesSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: LocalesState = {
  locales: [],
  localesLoadingStatus: RequestStatus.fulfilled,
  nextLocalesToken: null,
  currentLocalesSearchPage: 1,
  isLastLocalesSearchPageLoaded: false,
  isLoadingMore: false,
};

export const fetchLocales = createAsyncThunk(
  'locales/fetchLocales',
  async (data: any, thunkAPI) => {
    const { nextToken, limit, page, siteId } = data;
    await DocumentsService.getLocales(siteId, limit, nextToken).then(
      (response: any) => {
        if (response.status === 200) {
          const data = {
            locales: response.locales,
            isLoadingMore: false,
            isLastSearchPageLoaded: false,
            next: response.next,
            page,
          };
          if (page > 1) {
            data.isLoadingMore = true;
          }
          if (response.locales?.length === 0) {
            data.isLastSearchPageLoaded = true;
          }
          thunkAPI.dispatch(setLocales(data));
        } else {
          let dialogTitle = 'Error fetching locales';
          if (response.errors) {
            dialogTitle = response.errors[0].error;
          }
          thunkAPI.dispatch(openNotificationDialog({ dialogTitle }));
        }
      }
    );
  }
);

export const addLocale = createAsyncThunk(
  'locales/addLocale',
  async (data: any) => {
    const { siteId, locale } = data;
    await DocumentsService.addLocale(siteId, locale).then((response: any) => {
      if (response.status !== 201) {
        let dialogTitle = 'Error adding locale';
        if (response.errors) {
          dialogTitle = response.errors
            .map((item: any) => `${item.key}: ${item.error}`)
            .join('\n');
        }
        throw new Error(dialogTitle);
      }
    });
  }
);

export const deleteLocale = createAsyncThunk(
  'locales/deleteLocale',
  async (data: any, thunkAPI) => {
    const { siteId, locale } = data;
    await DocumentsService.deleteLocale(siteId, locale).then(
      (response: any) => {
        if (response.status === 200) {
          const localesState = (thunkAPI.getState() as any)?.localesState;
          const filteredLocales = localesState.locales.filter(
            (localeObject: Locale) => localeObject.locale !== locale
          );
          thunkAPI.dispatch(setLocale({ locales: filteredLocales }));
        } else {
          let dialogTitle = 'Error deleting locale';
          if (response.errors) {
            dialogTitle = response.errors[0].error;
          }
          thunkAPI.dispatch(openNotificationDialog({ dialogTitle }));
        }
      }
    );
  }
);

export const setLocale = createAsyncThunk(
  'locale/setLocale',
  async (data: any) => {
    const { siteId, locale, localeBody } = data;
    await DocumentsService.setLocale(siteId, locale, localeBody).then(
      (response: any) => {
        if (response.status !== 200) {
          let dialogTitle = 'Error updating locale';
          if (response.errors) {
            dialogTitle = response.errors
              .map((item: any) => `${item.key}: ${item.error}`)
              .join('\n');
          }
          throw new Error(dialogTitle);
        }
      }
    );
  }
);

export const localesSlice = createSlice({
  name: 'locales',
  initialState: defaultState,
  reducers: {
    setLocales: (state, action) => {
      const { locales, isLoadingMore, next } = action.payload;
      const isLastSearchPageLoaded = !next;
      if (locales) {
        if (isLoadingMore) {
          state.locales = state.locales.concat(locales);
        } else {
          state.locales = locales;
        }
        if (next) {
          state.nextLocalesToken = next;
        }
        if (isLastSearchPageLoaded !== undefined) {
          state.isLastLocalesSearchPageLoaded = isLastSearchPageLoaded;
        }
        state.localesLoadingStatus = RequestStatus.fulfilled;
      }
    },

    setLocalesLoadingStatusPending: (state) => {
      return {
        ...state,
        localeLoadingStatus: RequestStatus.pending,
      };
    },
  },
});

export const { setLocales, setLocalesLoadingStatusPending } =
  localesSlice.actions;

export const LocalesState = (state: RootState) => state.localesState;

export default localesSlice.reducer;
