import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  Locale,
  LocaleResourceItem,
  RequestStatus,
} from '../../helpers/types/locales';
import { RootState } from '../store';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

interface LocalesState {
  locales: Locale[];
  resourceItems: LocaleResourceItem[]; // renamed here
  localesLoadingStatus: keyof typeof RequestStatus;
  nextLocalesToken: string | null;
  currentLocalesSearchPage: number;
  isLastLocalesSearchPageLoaded: boolean;
  isLoadingMore: boolean;
}

const defaultState: LocalesState = {
  locales: [],
  resourceItems: [], // renamed here
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
            isLoadingMore: page > 1,
            isLastSearchPageLoaded: response.locales?.length === 0,
            next: response.next,
            page,
          };
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

export const fetchLocaleResourceItems = createAsyncThunk(
  'locales/fetchLocaleResourceItems',
  async (data: any, thunkAPI) => {
    const { siteId, locale, nextToken, limit, page } = data;
    await DocumentsService.getLocaleResourceItems(
      locale,
      siteId,
      nextToken,
      limit
    ).then((response) => {
      if (response) {
        const payload = {
          resourceItems: response.resourceItems, // use resourceItems from response
          isLoadingMore: page > 1,
          isLastSearchPageLoaded: response.resourceItems?.length === 0,
          next: response.next,
          page,
        };
        thunkAPI.dispatch(setLocaleResourceItems(payload));
      }
    });
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
          thunkAPI.dispatch(setLocales({ locales: filteredLocales }));
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

export const updateLocale = createAsyncThunk(
  'locale/updateLocale',
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

export const deleteLocaleResourceItem = createAsyncThunk(
  'rulesets/deleteLocaleResourceItem',
  async (data: any, thunkAPI) => {
    const { siteId, itemKey, locale, resourceItems } = data;
    await DocumentsService.deleteLocaleResourceItem(
      locale,
      itemKey,
      siteId
    ).then((response) => {
      if (response.status === 200) {
        thunkAPI.dispatch(
          setLocaleResourceItems({
            resourceItems: resourceItems.filter(
              (resourceItem: LocaleResourceItem) =>
                resourceItem.itemKey !== itemKey
            ),
            next: null,
            page: 1,
          })
        );
      } else {
        thunkAPI.dispatch(
          openNotificationDialog({ dialogTitle: response.message })
        );
      }
    });
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
        state.nextLocalesToken = next;
        state.isLastLocalesSearchPageLoaded = isLastSearchPageLoaded;
      }
      state.localesLoadingStatus = RequestStatus.fulfilled;
    },
    setLocaleResourceItems: (state, action) => {
      const { resourceItems, isLoadingMore, next } = action.payload;
      const isLastSearchPageLoaded = !next;
      if (resourceItems) {
        if (isLoadingMore) {
          state.resourceItems = state.resourceItems.concat(resourceItems);
        } else {
          state.resourceItems = resourceItems;
        }
        state.nextLocalesToken = next;
        state.isLastLocalesSearchPageLoaded = isLastSearchPageLoaded;
      }
      state.localesLoadingStatus = RequestStatus.fulfilled;
    },
    setLocalesLoadingStatusPending: (state) => {
      return {
        ...state,
        localesLoadingStatus: RequestStatus.pending,
      };
    },
  },
});

export const {
  setLocales,
  setLocaleResourceItems,
  setLocalesLoadingStatusPending,
} = localesSlice.actions;

export const LocalesState = (state: RootState) => state.localesState;

export default localesSlice.reducer;
