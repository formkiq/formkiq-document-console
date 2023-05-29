import 'reflect-metadata';
import { RequestStatus } from '../../helpers/types/document';
import documentsReducer, {
  addDocumentTag,
  removeDocumentTag,
} from './documentsList';

jest.mock('../../helpers/services/documentsService.ts');

const documentsData = [
  {
    path: 'Screenshot from 2022-09-25 23-07-21.png',
    insertedDate: '2022-10-13T04:57:03+0000',
    lastModifiedDate: '2022-10-13T04:57:03+0000',
    checksum: 'e978b442d4a99822afa7c1b7e45fc0fd',
    contentLength: 319034,
    documentId: 'c8f67654-687e-4f33-b7d5-8f9ff41b5811',
    type: 'USERDEFINED',
    value: 'regan@formkiq.com',
    key: 'folder',
    contentType: 'image/png',
    userId: 'regan@formkiq.com',
    favoritedBy: 'regan@formkiq.com',
    matchedTag: {
      type: 'USERDEFINED',
      value: 'regan@formkiq.com',
      key: 'folder',
      contentType: 'image/png',
      userId: 'regan@formkiq.com',
    },
    tags: {
      favoritedBy: 'regan@formkiq.com',
    },
  },
  {
    path: 'Screenshot from 2022-09-25 23-57-22.png',
    insertedDate: '2022-10-13T04:04:01+0000',
    lastModifiedDate: '2022-10-13T04:04:01+0000',
    checksum: '9a3d5da0acf7434369c0dd84575c1e97',
    contentLength: 324051,
    documentId: '6d8d85c7-e272-42f7-bfae-d0efaaa0c73a',
    contentType: 'image/png',
    userId: 'regan@formkiq.com',
    matchedTag: {
      type: 'USERDEFINED',
      value: 'regan@formkiq.com',
      key: 'folder',
      contentType: 'image/png',
      userId: 'regan@formkiq.com',
      favoritedBy: 'regan@formkiq.com',
    },
  },
];

test('should remove and add value from the document tag and update it in list', () => {
  const previousState: any = {
    documents: documentsData,
    nextLoadingStatus: RequestStatus.fulfilled,
    nextToken: null,
    currentSearchPage: 1,
    isLastSearchPageLoaded: false,
  };

  let file = documentsData[0];
  let data = documentsReducer(
    previousState,
    addDocumentTag({
      doc: file,
      tagKey: 'myTestTag',
      valueToAdd: 'myTestValue',
    })
  );
  expect(data.documents[0].tags).toEqual({
    favoritedBy: 'regan@formkiq.com',
    myTestTag: 'myTestValue',
  });

  file = data.documents[0];
  data = documentsReducer(
    previousState,
    addDocumentTag({
      doc: file,
      tagKey: 'myTestTag',
      valueToAdd: 'myTestValue2',
    })
  );
  expect(data.documents[0].tags).toEqual({
    favoritedBy: 'regan@formkiq.com',
    myTestTag: ['myTestValue', 'myTestValue2'],
  });

  file = data.documents[0];
  data = documentsReducer(
    previousState,
    removeDocumentTag({
      doc: file,
      tagKey: 'myTestTag',
      valueToRemove: 'myTestValue2',
    })
  );
  expect(data.documents[0].tags).toEqual({
    favoritedBy: 'regan@formkiq.com',
    myTestTag: 'myTestValue',
  });

  file = data.documents[0];
  data = documentsReducer(
    previousState,
    removeDocumentTag({
      doc: file,
      tagKey: 'myTestTag',
      valueToRemove: 'myTestValue',
    })
  );
  expect(data.documents[0].tags).toEqual({ favoritedBy: 'regan@formkiq.com' });
});
