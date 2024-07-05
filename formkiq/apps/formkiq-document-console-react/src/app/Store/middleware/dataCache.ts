import {createListenerMiddleware, isAnyOf} from '@reduxjs/toolkit';
import {LocalStorage} from '../../helpers/tools/useLocalStorage';
import {
  setAllTags,
  setAllAttributes,
  setFormkiqClient,
  setCurrentDocumentPath,
} from '../reducers/data';

const storage: LocalStorage = LocalStorage.Instance;
const dataCacheMiddleware = createListenerMiddleware();

const updateDataCache = async (action: any) => {
  // Run whatever additional side-effect-y logic you want here
  const dataCache = storage.getDataCache();
  if (dataCache) {
    switch (action.type) {
      case 'dataCache/setAllTags':
        dataCache.allTags = action.payload.allTags;
        dataCache.tagsSiteId = action.payload.tagsSiteId;
        dataCache.tagsLastRefreshed = action.payload.tagsLastRefreshed;
        break;
      case 'dataCache/setAllAttributes':
        dataCache.allAttributes = action.payload.allAttributes;
        dataCache.attributesSiteId = action.payload.attributesSiteId;
        dataCache.attributesLastRefreshed = action.payload.attributesLastRefreshed;
        break;
      case 'dataCache/setFormkiqClient':
        dataCache.formkiqClient = action.payload;
        break;
      case 'dataCache/setCurrentDocumentPath':
        dataCache.currentDocumentPath = action.payload;
        break;
    }
    storage.setDataCache(dataCache);
  }
  // Can cancel other running instances
};
// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
dataCacheMiddleware.startListening({
  matcher: isAnyOf(
    setAllTags,
    setAllAttributes,
    setFormkiqClient,
    setCurrentDocumentPath,
  ),
  effect: updateDataCache,
});

export default dataCacheMiddleware;
