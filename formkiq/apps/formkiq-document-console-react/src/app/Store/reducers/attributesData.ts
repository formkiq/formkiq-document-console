import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {DocumentsService} from "../../helpers/services/documentsService";
import {setAllAttributes} from "../../helpers/tools/useCacheStorage";


export interface attributesData {
  tagsLastRefreshed: Date;
  allTags: any[];
  tagsSiteId: string;
  attributesLastRefreshed: Date;
  allAttributes: any[];
  attributesSiteId: string;
}

const initialState = {
  tagsLastRefreshed: new Date(new Date().getTime() - (60 * 1000)), // 60 seconds earlier to ensure tags are refreshed after first log in
  allTags: [] as any,
  tagsSiteId: 'default',
  attributesLastRefreshed: new Date(new Date().getTime() - (60 * 1000)),
  allAttributes: [] as any,
  attributesSiteId: 'default',
} as attributesData;

export const fetchAttributesData = createAsyncThunk(
  'attributes/fetchAttributes',
  async (data: any, thunkAPI) => {
    const {siteId, nextToken, limit = 100} = data;
    await DocumentsService.getAttributes(siteId, nextToken, limit).then(
      (response) => {
        if (response.status === 200) {
          const allAttributesData = {
            allAttributes: response?.attributes,
            attributesLastRefreshed: new Date(),
            attributesSiteId: siteId,
          };
          setAllAttributes(allAttributesData);
          thunkAPI.dispatch(setAllAttributesData(allAttributesData));
        }
      }
    );
  }
);

export const attributesDataSlice = createSlice({
  name: 'attributesData',
  initialState: initialState,
  reducers: {
    setAllTagsData: (state, action: PayloadAction<any>) => {
      const {tagsLastRefreshed, allTags, tagsSiteId} = action.payload;
      const refreshed = tagsLastRefreshed;
      const newSiteId = tagsSiteId;
      const tags = [...allTags];
      return {
        ...state,
        allTags: tags,
        tagsLastRefreshed: refreshed,
        tagsSiteId: newSiteId,
      };
    },
    setAllAttributesData: (state, action: PayloadAction<any>) => {
      const {attributesLastRefreshed, allAttributes, attributesSiteId} =
        action.payload;
      const refreshed = attributesLastRefreshed;
      const newSiteId = attributesSiteId;
      const attributes = [...allAttributes];
      return {
        ...state,
        allAttributes: attributes,
        attributesLastRefreshed: refreshed,
        attributesSiteId: newSiteId,
      };
    },
  },
});

export const {setAllTagsData, setAllAttributesData} = attributesDataSlice.actions;

export const AttributesDataState = (state: RootState) => state.attributesDataState;

export default attributesDataSlice.reducer;
