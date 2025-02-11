export interface ApiItem {
  method: string;
  path: string;
  username: string;
  hasNoParams: boolean;
  requiresSite: boolean;
  requiresShareKey: boolean;
  allowsShareKey: boolean;
  requiresAuthentication: boolean;
  requiresDocumentID: boolean;
  requiresWebhookID: boolean;
  requiresWorkflowID: boolean;
  requiresCaseID: boolean;
  requiresTaskID: boolean;
  requiresNigoID: boolean;
  requiresRulesetID: boolean;
  requiresRuleID: boolean;
  requiresObjectId: boolean;
  requiresTagKey: boolean;
  allowsIndexKey: boolean;
  requiresIndexKey: boolean;
  requiresPostJson: boolean;
  requiresFileUpload: boolean;
  requiresIndexType: boolean;
  requiresQueueId: boolean;
  requiresAttributeKey: boolean;
  requiresAttributeValue: boolean;
  requiresGroupName: boolean;
  requiresUsername: boolean;
  requiresUserOperation: boolean;
  requiresWS: boolean;
  requiresClassificationID: boolean;
  requiresMappingID: boolean;
  requiresEnvelopeID: boolean;
  allowsVersionKey: boolean;
  allowsDate: boolean;
  allowsLimit: boolean;
  hasPagingTokens: boolean;
  hasOnlyNextPagingToken: boolean;
  allowsPath: boolean;
  showDeprecationMessage: boolean;
  deprecationMessage: string;
  license: string;
}

export const getDocumentsApiItem = {
  method: 'GET',
  path: '/documents',
  description:
    'Returns a list of the most recent documents added, ordered by inserted date (descending)',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsDate: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const getDocumentApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID ',
  description: "Retrieves a document's details, i.e., metadata",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const postDocumentsApiItem = {
  method: 'POST',
  path: '/documents',
  description:
    "Creates a new document; the body may include the document's content if it's less than 5 MB",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","content":"{\\"name\\": \\"John Smith\\"}","tags":[{"key":"content","value":"text"}],"contentType": "application/json"}',
  license: 'Core',
};

export const postDocumentsPublicApiItem = {
  method: 'POST',
  path: '/public/documents',
  description:
    'Allows unauthenticated creation of new documents; must be enabled during installation (disabled by default)',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: false,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","content":{"name":"John Smith"},"tags":[{"key":"content","value":"text"}]}',
  license: 'Core',
};

export const patchDocumentApiItem = {
  method: 'PATCH',
  path: '/documents/ DOCUMENT_ID ',
  description: "Update a document's details, i.e., metadata",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","tags":[{"key":"content","value":"text"}]}',
  license: 'Core',
};

export const deleteDocumentApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID ',
  description: 'Deletes a document - cannot be undone',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const getDocumentActionsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /actions',
  description: "Gets a document's actions and their status",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  hasOnlyNextPagingToken: true,
  allowsLimit: true,
  license: 'Core',
};

export const postDocumentActionsApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /actions',
  description: 'Adds an action to a document',
  username: 'Cognito User',
  requiresSite: true,
  //allowsShareKey: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  requiresDocumentID: true,
  defaultPostJsonValue: '{"actions":[{"type":"OCR"},{"type":"FULLTEXT"}]}',
  license: 'Core',
};

export const postDocumentCompressApiItem = {
  method: 'POST',
  path: '/documents/compress',
  description:
    'Compresses one or more documents into a ZIP file, accessible via S3 Signed URL',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"documentIds":[]}',
  license: 'Core',
};

export const putDocumentAntivirusApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /antivirus',
  description: 'Performs an antivirus and anti-malware scan on a document.',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Pro|Enterprise',
};

export const documentsDocumentIdTagsTagKeyGet = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY ',
  description: 'Get a document tag by using its key',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  license: 'Core',
};

export const documentsDocumentIdTagsTagKeyDelete = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY ',
  description: 'Delete a document tag by using its key',
  username: 'Cognito User',
  requiresSite: true,
  /*allowsShareKey: true,*/
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  license: 'Core',
};

export const getDocumentTagsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /tags',
  description: "Gets a listing of a document's tags",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const documentsTagsPatchApiItem = {
  method: 'PATCH',
  path: '/documents/tags',
  description:
    'Allows the adding/updating of multiple document tag(s) based on document(s) that have the matching tag',
  username: 'Cognito User',
  requiresSite: true,
  /*allowsShareKey: true,*/
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"match":{"tag": {"key":"MyTagKey","eq":"MyTagValue"}}, "update":{"tags": [{"key":"MyTagKey","value":"MyTagValue"}]}}',
  license: 'Core',
};

export const documentsDocumentIdTagsPost = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /tags',
  description:
    'Adds a single tag or multiple tags to a document, depending on the body of the request',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"key":"MyTagKey", "value":"MyTagValue"}',
  license: 'Core',
};

export const putDocumentTagApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY ',
  description:
    'Update any and all values of a document tag, by using its key; you can supply one tag value or a list of tag values in the request body',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"value":"MyTagValue"}',
  license: 'Core',
};

export const deleteDocumentTagValueApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY / TAG_VALUE ',
  description:
    "Delete a specific document tag's key/value combination; the request will be ignored if there is no valid key/value combination foundment tag",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  requiresTagValue: true,
  license: 'Core',
};

export const getDocumentAccessAttributesApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /accessAttributes',
  description: "Gets a listing of a document's accessAttributes",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const postDocumentAccessAttributesApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /accessAttributes',
  description: 'Adds access attributes to a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"accessAttributes":[{"key":"myKey","stringValue":"myValue"}]}',
  license: 'Pro|Enterprise',
};

export const putDocumentAccessAttributesApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /accessAttributes',
  description: 'Updates the access attributes for a document',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"accessAttributes":[{"key":"myKey","stringValue":"myValue"}]}',
  license: 'Pro|Enterprise',
};

export const deleteDocumentAccessAttributesApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /accessAttributes ',
  description: 'Deletes the access attributes for a document',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Pro|Enterprise',
};

export const getDocumentContentApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /content',
  description:
    'Get a document\'s contents. text/*, application/json, application/x-www-form-urlencoded returns a "content" field, while all other content-types returns a "contentUrl" for retrieving the content.',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsVersionKey: true,
  license: 'Core',
};

export const getDocumentOcrApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /ocr',
  description:
    "Gets a document's optical character recognition (OCR) result, if exists",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsContentUrl: true,
  allowsRawText: true,
  license: 'Core',
};

export const postDocumentOcrApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /ocr',
  description:
    'Document optical character recognition (OCR) request; extract text and data from a document.',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresParseTypes: true,
  requiresAddPdfDetectedCharactersAsText: true,
  allowsContentUrl: true,
  allowsRawText: true,
  license: 'Core',
};

export const putDocumentOcrApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /ocr',
  description: "Sets a document's optical character recognition (OCR) result",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresIsBase64: true,
  requiresContent: true,
  requiresContentType: true,
  license: 'Core',
};

export const deleteDocumentOcrApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /ocr',
  description:
    "Deletes a document's optical character recognition (OCR) result, if exists",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsContentUrl: true,
  allowsRawText: true,
  license: 'Core',
};

export const getDocumentSyncsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /syncs',
  description: "Gets the status of a document's syncs with other services",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const getDocumentVersionsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /versions',
  description: 'Get a listing of document content versions',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Pro|Enterprise',
};

export const putDocumentVersionApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /versions',
  description: "Sets a document's current version to a previous version",
  username: 'Cognito User',
  requiresSite: true,
  //allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresVersionKey: true,
  license: 'Pro|Enterprise',
};

export const deleteDocumentVersionApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /versions/ VERSION_KEY ',
  description: "Sets a document's current version to a previous version",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresVersionKey: true,
  license: 'Pro|Enterprise',
};

export const getDocumentUrlApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /url',
  description:
    "Returns a URL for the document's contents that expires (the default duration is 48 hours)",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsVersionKey: true,
  allowsInline: true,
  allowsDuration: true,
  license: 'Core',
};

export const getNewDocumentUploadApiItem = {
  method: 'GET',
  path: '/documents/upload',
  description:
    'Returns a URL that can be used to upload document content and create a new document; required to add content that is larger than 5 MB',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  allowsDuration: true,
  allowsPath: true,
  license: 'Core',
};

export const postWithBodyForNewDocumentUploadApiItem = {
  method: 'POST',
  path: '/documents/upload',
  description:
    'Returns a URL that can be used to upload document content and create a new document; required to add content that is larger than 5 MB',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","tags":[{"key":"content","value":"text"}]}',
  allowsDuration: true,
  license: 'Core',
};

export const getDocumentReplaceUploadApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /upload',
  description:
    'Returns a URL that can be used to upload documents for a specific documentId (required for documents larger than 5 MB)',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsDuration: true,
  license: 'Core',
};

export const getFoldersApiItem = {
  method: 'GET',
  path: '/folders',
  description:
    'Get folders and documents within a folder (or at the top level)',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  allowsIndexKey: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postFoldersApiItem = {
  method: 'POST',
  path: '/folders',
  description: 'Adds a folder, either within a folder or at the top level',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"path":"MyFolderPath"}',
  license: 'Core',
};

export const moveDocumentApiItem = {
  method: 'POST',
  path: '/indices/folder/move',
  description: 'Performs a folder index move',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"source":"DocumentSourcePath", "target":"NewPathWithFoldersOnly/"}',
  license: 'Core',
};

export const deleteFolderApiItem = {
  method: 'DELETE',
  path: '/folders/ INDEX_KEY ',
  description: 'Performs a delete of a folder',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresIndexKey: true,
  license: 'Core',
};

export const deleteFolderDeprecatedApiItem = {
  method: 'DELETE',
  path: '/indices/folder/ INDEX_KEY ',
  description: 'Performs a delete of a key from the folder index',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresIndexKey: true,
  showDeprecationMessage: true,
  deprecationMessage: 'Deprecated. Please use DELETE /folders/ INDEX_KEY ',
  license: 'Core',
};

export const deleteTagFromIndexApiItem = {
  method: 'DELETE',
  path: '/indices/tag/ TAG_KEY ',
  username: 'Cognito User',
  hasNoParams: false,
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: false,
  requiresWebhookID: false,
  requiresTagKey: true,
  requiresIndexKey: false,
  requiresPostJson: false,
  requiresFileUpload: false,
  requiresIndexType: false,
  allowsVersionKey: false,
  allowsDate: false,
  allowsLimit: false,
  hasPagingTokens: false,
  allowsPath: false,
  license: 'Core',
};

export const searchDocumentQueryApiItem = {
  method: 'POST',
  path: '/search',
  description:
    'Document search query request; documents are searched primarily using a document tag key and optional tag value, while an optional documentIds parameter is also available in the DocumentSearchBody to filter within up to 100 documentIds',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"query":{ "tag": {"eq":"MyTagValue", "key":"MyTagKey"}}}',
  requiresFileUpload: false,
  requiresIndexType: false,
  allowsVersionKey: false,
  allowsDate: false,
  allowsLimit: true,
  hasPagingTokens: true,
  allowsPath: false,
  license: 'Core',
};

export const postSearchIndices = {
  method: 'POST',
  path: '/indices/search',
  description: 'Performs a search on an index',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresIndexType: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const documentFulltextSearch = {
  method: 'POST',
  path: '/searchFulltext',
  description:
    'Document full text search (and more robust multi-tag search queries, powered by Typesense or OpenSearch)',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"query":{"text":"abc*","page":1}}',
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const fulltextQueryApiItem = {
  method: 'POST',
  path: '/queryFulltext',
  description:
    'Endpoint for allowing custom, complex queries using the OpenSearch search API',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"query":{"bool":{"must":[{"query_string":{"query":"myuser","fields":["content","tags.approvedBy"]}}]}}}',
  allowsLimit: false,
  hasPagingTokens: false,
  allowsPath: false,
  license: 'Pro|Enterprise',
};

export const getDocumentFulltextApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /fulltext',
  description: "Retrieves an OpenSearch document's details, i.e., metadata",
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const putDocumentFulltextApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /fulltext',
  description: 'Sets all text/tags found within a document to OpenSearch',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresContentType: true,
  requiresContentOrContentUrls: true,
  allowsPath: true,
  allowsTagJson: true,
  defaultTagJsonValue: '[{"key":"MyTagKey", "value":"MyTagValue"}]',
  license: 'Core',
};

export const patchDocumentFulltextApiItem = {
  method: 'PATCH',
  path: '/documents/ DOCUMENT_ID /fulltext',
  description: 'Updates specific text/tags within a document to OpenSearch',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsContentType: true,
  allowsContentOrContentUrls: true,
  allowsPath: true,
  allowsTagJson: true,
  defaultTagJsonValue: '[{"key":"MyTagKey", "value":"MyTagValue"}]',
  license: 'Core',
};

export const deleteDocumentFulltextApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /fulltext',
  description: 'Removes full text search for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const deleteDocumentFulltextTagApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /fulltext/ TAG_KEY ',
  description: 'Removes a tag from full text search for a document',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  license: 'Core',
};

export const deleteDocumentFulltextTagValueApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /fulltext/ TAG_KEY / TAG_VALUE ',
  description: 'Removes a tag value from full text search for a document',
  username: 'Cognito User',
  requiresSite: true,
  allowsShareKey: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  license: 'Core',
};

export const getWebhooksApiItem = {
  method: 'GET',
  path: '/webhooks',
  description:
    "Returns a list of webhooks; each webhook's id can be provided to an external service, allowing data to be sent, received, and processed via that webhook",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postWebhooksApiItem = {
  method: 'POST',
  path: '/webhooks',
  description:
    "Create a new webhook; once created, a webhook's id can be provided to an external service, allowing data to be sent, received, and processed via that webhook",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresName: true,
  allowsTtl: true,
  requiresEnabled: true,
  allowsTagJson: true,
  defaultTagJsonValue: '[{"key":"MyTagKey", "value":"MyTagValue"}]',
  license: 'Core',
};

export const getWebhookApiItem = {
  method: 'GET',
  path: '/webhooks/ WEBHOOK_ID ',
  description: "Returns a webhook's details, i.e., its metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
  license: 'Core',
};

export const deleteWebhookApiItem = {
  method: 'DELETE',
  path: '/webhooks/ WEBHOOK_ID ',
  description:
    'Deletes a webhook; this will disable sending, receiving, or processing of data from external services to this webhook',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
  license: 'Core',
};

export const patchWebhookApiItem = {
  method: 'PATCH',
  path: '/webhooks/ WEBHOOK_ID ',
  description: "Updates a webhook's details, i.e., its metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
  allowsName: true,
  allowsTtl: true,
  requiresEnabled: true,
  allowsTagJson: true,
  defaultTagJsonValue: '[{"key":"MyTagKey", "value":"MyTagValue"}]',
  license: 'Core',
};

export const getWebhookTagsApiItem = {
  method: 'GET',
  path: '/webhooks/ WEBHOOK_ID /tags ',
  description: "Gets a webhook's tags",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
  requiresTagKey: true,
  license: 'Core',
};

export const postWebhookTagsApiItem = {
  method: 'POST',
  path: '/webhooks/ WEBHOOK_ID /tags',
  description:
    'Adds a single tag or multiple tags to a webhook, depending on the body of the request',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"key":"MyTagKey", "value":"MyTagValue"}',
  license: 'Core',
};

export const postPrivateWebhooksApiItem = {
  method: 'POST',
  path: '/private/webhooks/ WEBHOOK_ID ',
  description:
    "Receives an incoming private webhook and creates a document based on the webhook's body; requires authentication",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
  requiresPostJson: true,
  license: 'Core',
};

export const postPublicWebhooksApiItem = {
  method: 'POST',
  path: '/public/webhooks/ WEBHOOK_ID ',
  description:
    'Receives an incoming public post to a specified webhook and creates a document based on the data sent; must be enabled during installation (disabled by default)',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: false,
  requiresWebhookID: true,
  requiresPostJson: true,
  license: 'Core',
};

export const getWorkflowsApiItem = {
  method: 'GET',
  path: '/workflows',
  description: 'Returns a list of workflows',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const getWorkflowApiItem = {
  method: 'GET',
  path: '/workflows/ WORKFLOW_ID ',
  description: "Returns a workflow's details, i.e., its metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWorkflowID: true,
  license: 'Pro|Enterprise',
};

export const postWorkflowsApiItem = {
  method: 'POST',
  path: '/workflows',
  description: 'Create a new workflow',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"name":"Test Workflow","description":"Some description","status":"INACTIVE", "config":{"notificationType":"none"},"steps":[]}',
  license: 'Pro|Enterprise',
};

export const putWorkflowsApiItem = {
  method: 'PUT',
  path: '/workflows/ WORKFLOW_ID ',
  description: 'Updates (by replacing) a workflow',
  username: 'Cognito User',
  requiresSite: true,
  requiresWorkflowID: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"name":"Test Workflow","description":"Some description","status":"INACTIVE", "config":{"notificationType":"none"},"steps":[]}',
  license: 'Pro|Enterprise',
};

export const deleteWorkflowApiItem = {
  method: 'DELETE',
  path: '/workflows/ WORKFLOW_ID ',
  description: 'Deletes a workflow',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWorkflowID: true,
  license: 'Pro|Enterprise',
};

export const getDocumentsInWorkflowApiItem = {
  method: 'GET',
  path: '/workflows/ WORKFLOW_ID /documents',
  description: 'Returns a list of documents in a specified workflow',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWorkflowID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const getQueuesApiItem = {
  method: 'GET',
  path: '/queues',
  description: 'Returns a list of queues',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  hasNoParams: true,
  license: 'Pro|Enterprise',
};

export const postQueuesApiItem = {
  method: 'POST',
  path: '/queues',
  description: 'Create a new queue',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"name":"Test Queue"}',
  license: 'Pro|Enterprise',
};

export const getQueueApiItem = {
  method: 'GET',
  path: '/queues/ QUEUE_ID ',
  description: 'Retreives a queue',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresQueueId: true,
  license: 'Pro|Enterprise',
};

export const deleteQueueApiItem = {
  method: 'DELETE',
  path: '/queues/ QUEUE_ID ',
  description: 'Deletes a queue',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresQueueId: true,
  license: 'Pro|Enterprise',
};

export const getDocumentsInQueueApiItem = {
  method: 'GET',
  path: '/queues/ QUEUE_ID /documents',
  description: 'Returns a list of documents in a specified queue',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresQueueId: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const getWorkflowsInDocumentApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /workflows',
  description:
    'Returns a list of workflows that have been assigned to a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const getWorkflowByIdInDocumentApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /workflows/ WORKFLOW_ID ',
  description: 'Returns a workflow by ID that has been assigned to a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresWorkflowID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const postDocumentWorkflowApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /workflows',
  description: 'Assigns a workflow to a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"workflowId":"WORKFLOW_ID"}',
  license: 'Pro|Enterprise',
};

export const postDocumentWorkflowDecisionsApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /workflows/ WORKFLOW_ID /decisions',
  description: 'Adds a decision to a document approval step',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresWorkflowID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"queueId":"QUEUE_ID", "decision": "ACCEPT|REJECT", "comments": ""}',
  license: 'Pro|Enterprise',
};

export const getSitesApiItem = {
  method: 'GET',
  path: '/sites',
  description: 'Returns the list of sites that the user has access to',
  username: 'Cognito User',
  requiresAuthentication: true,
  hasNoParams: true,
  license: 'Core',
};

export const getSharesApiItem = {
  method: 'GET',
  path: '/shares',
  description: 'Returns the list of shares that the user has access to',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  hasNoParams: true,
  license: 'Pro|Enterprise',
};

export const postShareFolderApiItem = {
  method: 'POST',
  path: '/shares/folders/ INDEX_KEY ',
  description:
    "Creates a folder share; you can retrieve the folder's index key using GET /folders and specifying the site and the parent folder, if one exists",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresIndexKey: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"share":{"group":"default", "permissions":"READ,WRITE"}}',
  license: 'Pro|Enterprise',
};

export const deleteShareApiItem = {
  method: 'DELETE',
  path: '/shares/ SHARE_KEY ',
  description: 'Deletes an share',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresShareKey: true,
  license: 'Pro|Enterprise',
};

export const getVersionApiItem = {
  method: 'GET',
  path: '/version',
  description: 'Return the version of FormKiQ',
  username: 'Cognito User',
  hasNoParams: true,
  requiresSite: false,
  requiresAuthentication: true,
  license: 'Core',
};

export const getConfigurationApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /configuration',
  description: 'Returns the current configuration',
  username: 'Cognito User',
  hasNoParams: true,
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const postConfigurationApiItem = {
  method: 'PATCH',
  path: '/sites/ SITE_ID /configuration',
  description: 'Updates the current configuration',
  username: 'Cognito User',
  requiresPostJson: true,
  requiresAuthentication: true,
  requiresSite: true,
  defaultPostJsonValue:
    '{"chatGptApiKey": "ABC","maxContentLengthBytes": "1000000","maxDocuments": "1000","maxWebhooks": "10","notificationEmail": "<email>"}',
  license: 'Core',
};

export const getConfigurationOpaPoliciesApiItem = {
  method: 'GET',
  path: '/sites/opa/accessPolicies',
  description: 'Returns all Open Policy Agent (OPA) access policies',
  username: 'Cognito User',
  hasNoParams: true,
  requiresAuthentication: true,
  license: 'Pro|Enterprise',
};

export const getConfigurationOpaPolicyApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /opa/accessPolicy',
  description:
    "Returns the current site's Open Policy Agent (OPA) access policy",
  username: 'Cognito User',
  hasNoParams: true,
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const getConfigurationOpaPolicyItemsApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /opa/accessPolicy/policyItems',
  description:
    "Returns the current site's Open Policy Agent (OPA) access policy",
  username: 'Cognito User',
  hasNoParams: true,
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

// NOTE: this endpoint will be updated soon
export const putConfigurationOpaPolicyApiItem = {
  method: 'PUT',
  path: '/sites/ SITE_ID /opa/accessPolicy/policyItems',
  description:
    "Updates the current site's Open Policy Agent (OPA) access policy",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"policyItems": [{"type": "ALLOW","policy": "newPolicy","allRoles": ["user"]},{"type": "ALLOW","policy": "newPolicy2","allRoles": ["admin"]}]}',
  license: 'Pro|Enterprise',
};

export const deleteConfigurationOpaPolicyApiItem = {
  method: 'DELETE',
  path: '/sites/ SITE_ID /opa/accessPolicy/policyItems',
  description:
    "Deletes the current site's Open Policy Agent (OPA) access policy",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Pro|Enterprise',
};

export const getApiKeysApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /apiKeys',
  description: 'Gets the current api keys',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const postApiKeysApiItem = {
  method: 'POST',
  path: '/sites/ SITE_ID /apiKeys',
  description: 'Sets the current api keys',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};
export const deleteApiKeyApiItem = {
  method: 'DELETE',
  path: '/sites/ SITE_ID /apiKeys/ API_KEY ',
  description: 'Deletes an api key',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const getCasesApiItem = {
  method: 'GET',
  path: '/cases',
  description: 'Returns a list of the Cases',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const postCaseApiItem = {
  method: 'POST',
  path: '/cases',
  description: 'Create a new case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"case":{"insertedDate":"2024-04-05T17:11:31+0000","name":"CaseName","description":"string","status":"NEW","startDate":"2024-04-09T04:00:00.000Z","endDate":"2024-04-09T04:00:00.000Z","tasks":[{"name":"New Task","description":"New Task Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}],"nigos":[{"name":"New NIGO","description":"New NIGO Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}]}}',
  license: 'Pro|Enterprise',
};

export const getCaseApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID ',
  description: 'Returns a Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  license: 'Pro|Enterprise',
};

export const patchCaseApiItem = {
  method: 'PATCH',
  path: '/cases/ CASE_ID ',
  description: 'Updates a Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"case":{"insertedDate":"2024-04-05T17:11:31+0000","name":"CaseName","description":"string","status":"NEW","startDate":"2024-04-09T04:00:00.000Z","endDate":"2024-04-09T04:00:00.000Z","tasks":[{"name":"New Task","description":"New Task Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}],"nigos":[{"name":"New NIGO","description":"New NIGO Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}]}}',
  license: 'Pro|Enterprise',
};

export const deleteCaseApiItem = {
  method: 'DELETE',
  path: '/cases/ CASE_ID ',
  description: 'Deletes a Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  license: 'Pro|Enterprise',
};

export const getCaseDocumentsApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID /documents',
  description: 'Returns documents in a Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const deleteCaseDocumentApiItem = {
  method: 'DELETE',
  path: '/cases/ CASE_ID /documents/ DOCUMENT_ID ',
  description: 'Deletes a document in a Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresDocumentID: true,
  license: 'Pro|Enterprise',
};

export const getTaskApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID /tasks/ TASK_ID ',
  description: 'Returns a Task in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  license: 'Pro|Enterprise',
};

export const patchTaskApiItem = {
  method: 'PATCH',
  path: '/cases/ CASE_ID /tasks/ TASK_ID ',
  description: 'Updates a Task in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"task":{"name":"New Task","description":"New Task Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}}',
  license: 'Pro|Enterprise',
};

export const deleteTaskApiItem = {
  method: 'DELETE',
  path: '/cases/ CASE_ID /tasks/ TASK_ID ',
  description: 'Deletes a Task in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  license: 'Pro|Enterprise',
};

export const getTaskDocumentsApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID /tasks/ TASK_ID /documents',
  description: 'Returns a list documents in a Task',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const deleteTaskDocumentApiItem = {
  method: 'DELETE',
  path: '/cases/ CASE_ID /tasks/ TASK_ID /documents/ DOCUMENT_ID ',
  description: 'Deletes a document in a Task',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  requiresDocumentID: true,
  license: 'Pro|Enterprise',
};

export const getNigoApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID /nigos/ NIGO_ID ',
  description: 'Returns a NIGO in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  license: 'Pro|Enterprise',
};

export const patchNigoApiItem = {
  method: 'PATCH',
  path: '/cases/ CASE_ID /nigos/ NIGO_ID ',
  description: 'Updates a NIGO in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"nigo":{"name":"New NIGO","description":"New Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}}',
  license: 'Pro|Enterprise',
};

export const deleteNigoApiItem = {
  method: 'DELETE',
  path: '/cases/ CASE_ID /nigos/ NIGO_ID ',
  description: 'Deletes a NIGO in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  license: 'Pro|Enterprise',
};

export const getNigoDocumentsApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID /nigos/ NIGO_ID /documents',
  description: 'Returns a list documents in a NIGO',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const deleteNigoDocumentApiItem = {
  method: 'DELETE',
  path: '/cases/ CASE_ID /nigos/ NIGO_ID /documents/ DOCUMENT_ID ',
  description: 'Deletes a document in a NIGO',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresTaskID: true,
  requiresDocumentID: true,
  license: 'Pro|Enterprise',
};

export const getTasksApiItem = {
  method: 'GET',
  path: '/cases/ CASE_ID /tasks',
  description: 'Returns a list of Tasks in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const getNigosApiItem = {
  method: 'GET',
  path: '/cases/ NIGO_ID /tasks',
  description: 'Returns a list of NIGOs in Case',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const postTaskApiItem = {
  method: 'POST',
  path: '/cases/ CASE_ID /tasks',
  description: 'Add new task',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"task":{"name":"New Task","description":"New Task Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}}',
  license: 'Pro|Enterprise',
};

export const postNigoApiItem = {
  method: 'POST',
  path: '/cases/ CASE_ID /nigos',
  description: 'Add new NIGO',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresCaseID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"nigo":{"name":"New NIGO","description":"New Description","insertedDate":"2024-04-09T04:00:00.000Z","status":"NEW"}}',
  license: 'Pro|Enterprise',
};

export const getRulesetsApiItem = {
  method: 'GET',
  path: '/rulesets',
  description: 'Returns a list of rulesets',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const postRulesetsApiItem = {
  method: 'POST',
  path: '/rulesets',
  description: 'Create a new ruleset',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"ruleset": {"description": "Test Ruleset", "priority": 0, "version": 0,  "status": "ACTIVE"  }}',
  license: 'Pro|Enterprise',
};

export const getRulesetApiItem = {
  method: 'GET',
  path: '/rulesets/ RULESET_ID ',
  description: 'Returns a ruleset',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresRulesetID: true,
  license: 'Pro|Enterprise',
};

export const patchRulesetApiItem = {
  method: 'PATCH',
  path: '/rulesets/ RULESET_ID ',
  description: 'Updates (by replacing) a ruleset',
  username: 'Cognito User',
  requiresSite: true,
  requiresRulesetID: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{ "ruleset": { "description": "Test Ruleset", "priority": 0, "version": 0, "status": "ACTIVE" }}',
  license: 'Pro|Enterprise',
};

export const deleteRulesetApiItem = {
  method: 'DELETE',
  path: '/rulesets/ RULESET_ID ',
  description: 'Deletes a ruleset',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresRulesetID: true,
  license: 'Pro|Enterprise',
};

export const getRulesApiItem = {
  method: 'GET',
  path: '/rulesets/ RULESET_ID /rules',
  description: 'Returns a list of rules in a ruleset',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresRulesetID: true,
  license: 'Pro|Enterprise',
};

export const postRuleApiItem = {
  method: 'POST',
  path: '/rulesets/ RULESET_ID /rules',
  description: 'Create a new rule',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  requiresRulesetID: true,
  defaultPostJsonValue:
    '{ "rule": { "priority": 0, "description": "Test Rule", "workflowId": "Test Workflow Id", "status": "ACTIVE", "conditions": { "must": [{ "attribute": "TEXT", "fieldName": "Test Field Name", "value": "Test Value", "operation": "EQ" }]}}}',
  license: 'Pro|Enterprise',
};

export const getRuleApiItem = {
  method: 'GET',
  path: '/rulesets/ RULESET_ID /rules/ RULE_ID ',
  description: 'Returns a rule in a ruleset',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresRulesetID: true,
  requiresRuleID: true,
  license: 'Pro|Enterprise',
};

export const patchRuleApiItem = {
  method: 'PATCH',
  path: '/rulesets/ RULESET_ID /rules/ RULE_ID ',
  description: 'Updates a rule',
  username: 'Cognito User',
  requiresSite: true,
  requiresRulesetID: true,
  requiresRuleID: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{ "rule": { "priority": 0, "description": "Test Rule", "workflowId": "Test Workflow Id", "status": "ACTIVE", "conditions": { "must": [{ "attribute": "TEXT", "fieldName": "Test Field Name", "value": "Test Value", "operation": "EQ" }]}}}',
  license: 'Pro|Enterprise',
};

export const deleteRuleApiItem = {
  method: 'DELETE',
  path: '/rulesets/ RULESET_ID /rules/ RULE_ID ',
  description: 'Deletes a rule',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresRulesetID: true,
  requiresRuleID: true,
  license: 'Pro|Enterprise',
};

export const getExaminePdfUploadUrlApiItem = {
  method: 'GET',
  path: '/objects/examine/pdf',
  description:
    'Get Signed URL for PDF Object Upload of a document to be examined by calling GET /objects/examine/{id}/pdf',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  license: 'Core',
};

export const getExaminePdfDetailsApiItem = {
  method: 'GET',
  path: '/objects/examine/ OBJECT_ID /pdf',
  description:
    'Get PDF details from examine. File must have been uploaded previously using the GET /objects/examine/pdf API.',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresObjectID: true,
  license: 'Core',
};

export const getAttributesApiItem = {
  method: 'GET',
  path: '/attributes',
  description: 'Returns a list of attributes',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postAttributeApiItem = {
  method: 'POST',
  path: '/attributes',
  description: 'Create a new attribute',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"attribute": { "key": "string", "dataType": "STRING", "type": "STANDARD" }}',
  license: 'Core',
};

export const getAttributeApiItem = {
  method: 'GET',
  path: '/attributes/ ATTRIBUTE_KEY ',
  description: 'Returns an attribute',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresAttributeKey: true,
  license: 'Core',
};

export const deleteAttributeApiItem = {
  method: 'DELETE',
  path: '/attributes/ ATTRIBUTE_KEY ',
  description: 'Deletes an attribute',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresAttributeKey: true,
  license: 'Core',
};

export const getDocumentAttributesApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /attributes',
  description: 'Returns a list of attributes for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postDocumentAttributesApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /attributes',
  description: 'Create a new attribute for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresWS: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"attributes": [{"key": "string", "stringValue": "string", "stringValues": ["string"], "numberValue": 0, "numberValues": [0], "booleanValue": true}]}',
  license: 'Core',
};

export const putDocumentAttributesApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /attributes ',
  description: 'Updates an attribute for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"attributes": [{"key": "string", "stringValue": "string", "stringValues": ["string"], "numberValue": 0, "numberValues": [0], "booleanValue": true}]}',
  license: 'Core',
};

export const getDocumentAttributeApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /attributes/ ATTRIBUTE_KEY ',
  description: 'Returns an attribute for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresAttributeKey: true,
  license: 'Core',
};

export const putDocumentAttributeApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /attributes/ ATTRIBUTE_KEY ',
  description: 'Updates an attribute for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresAttributeKey: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"attribute": {"stringValue": "string", "stringValues": ["string"], "numberValue": 0, "numberValues": [0], "booleanValue": true}}',
  license: 'Core',
};

export const deleteDocumentAttributeApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /attributes/ ATTRIBUTE_KEY ',
  description: 'Deletes an attribute for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresAttributeKey: true,
  license: 'Core',
};

export const deleteDocumentAttributeValueApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /attributes/ ATTRIBUTE_KEY / ATTRIBUTE_VALUE ',
  description: 'Deletes an attribute value for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresAttributeKey: true,
  requiresAttributeValue: true,
  license: 'Core',
};

export const getGroupsApiItem = {
  method: 'GET',
  path: '/groups',
  description: 'Returns the list of user groups configured in the application',
  username: 'Cognito User',
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postGroupApiItem = {
  method: 'POST',
  path: '/groups',
  description: 'Add a new group',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"group": {"name": "groupName"}}',
  license: 'Core',
};

export const deleteGroupApiItem = {
  method: 'DELETE',
  path: '/groups/ GROUP_NAME ',
  description: 'Deletes a group',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresGroupName: true,
  license: 'Core',
};

export const getGroupUsersApiItem = {
  method: 'GET',
  path: '/groups/ GROUP_NAME /users',
  description: 'Returns the list of users in a group',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresGroupName: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postGroupUserApiItem = {
  method: 'POST',
  path: '/groups/ GROUP_NAME /users',
  description: 'Adds a user to a group',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresGroupName: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"user": {"username": "username"}}',
  license: 'Core',
};

export const deleteGroupUserApiItem = {
  method: 'DELETE',
  path: '/groups/ GROUP_NAME /users/ USERNAME ',
  description: 'Remove Username From Group',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresGroupName: true,
  requiresUsername: true,
  license: 'Core',
};

export const getUsersApiItem = {
  method: 'GET',
  path: '/users',
  description: 'Returns the list of users',
  username: 'Cognito User',
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postUserApiItem = {
  method: 'POST',
  path: '/users',
  description: 'Adds a user',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"user": {"username": "username"}}',
  license: 'Core',
};

export const getUserApiItem = {
  method: 'GET',
  path: '/users/ USERNAME ',
  description: 'Returns a user',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresUsername: true,
  license: 'Core',
};

export const deleteUserApiItem = {
  method: 'DELETE',
  path: '/users/ USERNAME ',
  description: 'Deletes a user',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresUsername: true,
  license: 'Core',
};

export const getUserGroupsApiItem = {
  method: 'GET',
  path: '/users/ USERNAME /groups',
  description: 'Returns the list of groups for a user',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresUsername: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const putUserOperationApiItem = {
  method: 'PUT',
  path: '/users/ USERNAME / USER_OPERATION ',
  description: 'Set user operation',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresUsername: true,
  requiresUserOperation: true,
  license: 'Core',
};

export const getGroupApiItem = {
  method: 'GET',
  path: '/groups/ GROUP_NAME ',
  description: 'Returns a group',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresGroupName: true,
  license: 'Core',
};

export const getSiteSchemaApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /schema/document',
  description: 'Returns site schema',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const putSiteSchemaApiItem = {
  method: 'PUT',
  path: '/sites/ SITE_ID /schema/document',
  description: 'Updates site schema',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"name":"My Site Schema","attributes":{"required":[{"attributeKey": "testKey"}]}}',
  license: 'Core',
};

export const getSiteClassificationsApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /classifications',
  description: 'Returns a list of classifications for a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const postSiteClassificationApiItem = {
  method: 'POST',
  path: '/sites/ SITE_ID /classifications',
  description: 'Adds a classification to a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"classification":{"name":"My Classification","attributes":{"required":[{"attributeKey": "testKey"}]}}}',
  license: 'Core',
};

export const getSiteClassificationApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /classifications/ CLASSIFICATION_ID ',
  description: 'Returns a classification for a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresClassificationID: true,
  license: 'Core',
};

export const deleteSiteClassificationApiItem = {
  method: 'DELETE',
  path: '/sites/ SITE_ID /classifications/ CLASSIFICATION_ID ',
  description: 'Deletes a classification for a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresClassificationID: true,
  license: 'Core',
};

export const putSiteClassificationApiItem = {
  method: 'PUT',
  path: '/sites/ SITE_ID /classifications/ CLASSIFICATION_ID ',
  description: 'Updates a classification for a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresClassificationID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{classification:{"name":"My Classification","attributes":{"required":[{"attributeKey": "testKey"}],"compositeKeys":[{"attributeKey":["testKey"]}]}}}',
  license: 'Core',
};

export const getUserActivitiesApiItem = {
  method: 'GET',
  path: '/userActivities',
  description: "Retrieve a user's activities",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresUsername: true,
  requiresSite: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const getDocumentUserActivitiesApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /userActivities',
  description: "Retrieve a user's activities",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Core',
};

export const getMappingsApiItem = {
  method: 'GET',
  path: '/mappings',
  description: 'Returns the list of mappings',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
};

export const postMappingApiItem = {
  method: 'POST',
  path: '/mappings',
  description: 'Create a new mapping',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"mapping":{"name":"mappingName","description":"mappingDescription","attributes":[{"attributeKey":"keyOnly","sourceType":"CONTENT","labelTexts":["string"],"labelMatchingType":"FUZZY","metadataField":"USERNAME","validationRegex":"string"}]}}',
  license: 'Pro|Enterprise',
};

export const getMappingApiItem = {
  method: 'GET',
  path: '/mappings/ MAPPING_ID ',
  description: 'Returns a mapping',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresMappingID: true,
  license: 'Pro|Enterprise',
};

export const putMappingApiItem = {
  method: 'PUT',
  path: '/mappings/ MAPPING_ID ',
  description: 'Updates a mapping',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresMappingID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"mapping":{"name":"newMappingName","description":"mappingDescription","attributes":[{"attributeKey":"keyOnly","sourceType":"CONTENT","labelTexts":["string"],"labelMatchingType":"FUZZY","metadataField":"USERNAME","validationRegex":"string"}]}}',
  license: 'Pro|Enterprise',
};

export const deleteMappingApiItem = {
  method: 'DELETE',
  path: '/mappings/ MAPPING_ID ',
  description: 'Deletes a mapping',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresMappingID: true,
  license: 'Pro|Enterprise',
};

export const postRetryDocumentActionsApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /actions/retry',
  description: 'Retries document actions',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  license: 'Core',
};

export const restoreDocumentApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /restore',
  description: 'Restore a document',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  license: 'Core',
};

export const postDocumentGenerateApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /generate',
  description:
    'Generates a new document using a specified template file and data sources. This operation allows users to merge data from multiple documents into a template to create a new document in the desired output format (e.g., DOCX). Each data source must include a data object, which contains key-value pairs that will be merged into the template. The value can be any valid JSON object. { "data":{}}; ',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"datasources": [{"name": "Data source name","documentId": "DOCUMENT_ID"}],"outputType": "DOCX"}',
  license: 'Pro|Enterprise',
};

export const postSitesApiItem = {
  method: 'POST',
  path: '/sites',
  description: 'Add a new site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"site": {"id": "siteId","title": "siteTitle", "status": "ACTIVE"}}',
  license: 'Core',
};

export const patchSitesApiItem = {
  method: 'PATCH',
  path: '/sites/ SITE_ID ',
  description: 'Update a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"site": {"title": "siteTitle", "status": "ACTIVE"}}',
  license: 'Core',
};

export const getSiteGroupsApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /groups',
  description: 'Returns list of groups and permissions belonging to site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const getSiteGroupApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /groups/ GROUP_NAME ',
  description: 'Returns details of a group and permissions belonging to site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresGroupName: true,
  license: 'Core',
};

export const putSiteGroupPermissionsApiItem = {
  method: 'PUT',
  path: '/sites/ SITE_ID /groups/ GROUP_NAME /permissions',
  description: "Set Site's Group Permissions",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresGroupName: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"permissions": ["ADMIN"]}',
  license: 'Core',
};

export const deleteSiteGroupPermissionsApiItem = {
  method: 'DELETE',
  path: '/sites/ SITE_ID /groups/ GROUP_NAME ',
  description: 'Deletes a group from a site',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresGroupName: true,
  license: 'Core',
};

export const postOnlyofficeEditApiItem = {
  method: 'POST',
  path: '/onlyoffice/ DOCUMENT_ID /edit',
  description: 'Provide ONLYOFFICE integration for editing documents',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue: '"string"',
  license: 'Core',
};

export const postOnlyofficeNewApiItem = {
  method: 'POST',
  path: '/onlyoffice/new',
  description:
    'Provide ONLYOFFICE integration for the creation of new documents',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"extension": "DOCX"}',
  license: 'Core',
};

export const postOnlyofficeSaveApiItem = {
  method: 'POST',
  path: '/onlyoffice/ DOCUMENT_ID /save',
  description: 'Save an update document for ONLYOFFICE integration',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  license: 'Core',
};

export const postEsignatureDocusignEnvelopeApiItem = {
  method: 'POST',
  path: '/esignature/docusign/ DOCUMENT_ID /envelopes',
  description: 'Create Docusign Envelope request',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"emailSubject":"Email Subject","environment":"PRODUCTION","signers":[{"name":"John Smith","email":"john.smith@mail.com","clientUserId":"user123","recipientId":"1","routingOrder":"1","suppressEmails":"false","tabs":{"signHereTabs":[{"anchorString":"/signature1/","anchorXOffset":"0","anchorYOffset":"0","anchorIgnoreIfNotPresent":"false","anchorUnits":"pixels","xPosition":"100","yPosition":"200","pageNumber":"1"}]}}],"inpersonSigners":[{"hostEmail":"sarah.host@mail.com","hostName":"Sarah Johnson","signerName":"Michael Brown","signerEmail":"michael.brown@mail.com","recipientId":"2","routingOrder":"2","suppressEmails":"false","tabs":{"signHereTabs":[{"anchorString":"/signature2/","anchorXOffset":"10","anchorYOffset":"10","anchorIgnoreIfNotPresent":"false","anchorUnits":"pixels","xPosition":"300","yPosition":"400","pageNumber":"2"}]}}],"notification":{"useAccountDefaults":"true","expirations":{"expireAfter":"120","expireEnabled":"true","expireWarn":"96"},"reminders":{"reminderDelay":"24","reminderEnabled":"true","reminderFrequency":"72"}}}',
  license: 'Core',
};

export const postEsignatureDocusignRecipientViewRequestApiItem = {
  method: 'POST',
  path: '/esignature/docusign/ DOCUMENT_ID /envelopes/ ENVELOPE_ID /views/recipient',
  description: 'Create Docusign Recipient View request',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresEnvelopeID: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"environment":"PRODUCTION","recipientView":{"returnUrl":"https://www.example.com","recipientId":"1","userName":"John Smith","clientUserId":"user123","email":"john.smith@mail.com","frameAncestors":["https://www.example.com","https://app.example.com"],"messageOrigins":["https://www.example.com","https://app.example.com"]}}',
  license: 'Core',
};

export const postEsignatureDocusignEventApiItem = {
  method: 'POST',
  path: '/esignature/docusign/events',
  description: 'Add E-signature event',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const getOpensearchIndexApiItem = {
  method: 'GET',
  path: '/sites/ SITE_ID /opensearch/index',
  description: 'Get site(s) OpenSearch index settings',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const putOpensearchIndexApiItem = {
  method: 'PUT',
  path: '/sites/ SITE_ID /opensearch/index',
  description: 'Set site(s) OpenSearch index settings',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"indexSettings":{"numberOfReplicas":"1","numberOfShards":"1"}}',
  license: 'Core',
};

export const deleteOpensearchIndexApiItem = {
  method: 'DELETE',
  path: '/sites/ SITE_ID /opensearch/index',
  description: 'Deletes site(s) OpenSearch index',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  license: 'Core',
};

export const postReindexApiItem = {
  method: 'POST',
  path: '/reindex/documents/ DOCUMENT_ID ',
  description:
    "The API allows for the reindexing of a document's metadata determined by the target.",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"target":"ATTRIBUTES"}',
  license: 'Core',
};

export const getPublicationApiItem = {
  method: 'GET',
  path: '/publications/ DOCUMENT_ID ',
  description: "Get published document's contents",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const deletePublicationApiItem = {
  method: 'DELETE',
  path: '/publications/ DOCUMENT_ID ',
  description: "Delete published document's contents",
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  license: 'Core',
};

export const postGoogleDocumentExport = {
  method: 'POST',
  path: '/orchestrations/google/drive/documents/ DOCUMENT_ID /export',
  description: 'Exports a Google Document',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"path":"file_path","outputType":"PDF"}',
  license: 'Core',
};
