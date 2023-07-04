export interface ApiItem {
  method: string;
  path: string;
  username: string;
  hasNoParams: boolean;
  requiresSite: boolean;
  requiresAuthentication: boolean;
  requiresDocumentID: boolean;
  requiresWebhookID: boolean;
  requiresTagKey: boolean;
  requiresIndexKey: boolean;
  requiresPostJson: boolean;
  requiresFileUpload: boolean;
  requiresIndexType: boolean;
  allowsVersionKey: boolean;
  allowsDate: boolean;
  allowsLimit: boolean;
  hasPagingTokens: boolean;
  allowsPath: boolean;
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
};

export const getDocumentApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID ',
  description: "Retrieves a document's details, i.e., metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
};

export const postDocumentsApiItem = {
  method: 'POST',
  path: '/documents',
  description:
    "Creates a new document; the body may include the document's content if it's less than 5 MB",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","content":{"name":"John Smith"},"tags":[{"key":"content","value":"text"}]}',
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
};

export const patchDocumentApiItem = {
  method: 'PATCH',
  path: '/documents/ DOCUMENT_ID ',
  description: "Update a document's details, i.e., metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","tags":[{"key":"content","value":"text"}]}',
};

export const deleteDocumentApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID ',
  description: 'Deletes a document - cannot be undone',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
};

export const getDocumentActionsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /actions',
  description: "Gets a document's actions and their status",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
};

export const postDocumentActionsApiItem = {
  method: 'POST',
  path: '/documents/ DOCUMENT_ID /actions',
  description: 'Adds an action to a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  requiresDocumentID: true,
  defaultPostJsonValue: '{"actions":[{"type":"OCR"},{"type":"FULLTEXT"}]}',
};

export const putDocumentAntivirusApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /antivirus',
  description: 'Performs an antivirus and anti-malware scan on a document.',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
};

export const documentsDocumentIdTagsTagKeyGet = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY ',
  description: 'Get a document tag by using its key',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
};

export const documentsDocumentIdTagsTagKeyDelete = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY ',
  description: 'Delete a document tag by using its key',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
};

export const getDocumentTagsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /tags',
  description: "Gets a listing of a document's tags",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
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
};

export const deleteDocumentTagValueApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /tags/ TAG_KEY / TAG_VALUE ',
  description:
    "Delete a specific document tag's key/value combination; the request will be ignored if there is no valid key/value combination foundment tag",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
  requiresTagValue: true,
};

export const getDocumentContentApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /content',
  description:
    'Get a document\'s contents. text/*, application/json, application/x-www-form-urlencoded returns a "content" field, while all other content-types returns a "contentUrl" for retrieving the content.',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsVersionKey: true,
};

export const getDocumentOcrApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /ocr',
  description:
    "Gets a document's optical character recognition (OCR) result, if exists",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsContentUrl: true,
  allowsRawText: true,
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
};

export const getDocumentVersionsApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /versions',
  description: 'Get a listing of document content versions',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
};

export const putDocumentVersionApiItem = {
  method: 'PUT',
  path: '/documents/ DOCUMENT_ID /versions',
  description: "Sets a document's current version to a previous version",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresVersionKey: true,
};

export const getDocumentUrlApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /url',
  description:
    "Returns a URL for the document's contents that expires (the default duration is 48 hours)",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsVersionKey: true,
  allowsInline: true,
  allowsDuration: true,
};

export const getNewDocumentUploadApiItem = {
  method: 'GET',
  path: '/documents/upload',
  description:
    'Returns a URL that can be used to upload document content and create a new document; required to add content that is larger than 5 MB',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsDuration: true,
  allowsPath: true,
};

export const postWithBodyForNewDocumentUploadApiItem = {
  method: 'POST',
  path: '/documents/upload',
  description:
    'Returns a URL that can be used to upload document content and create a new document; required to add content that is larger than 5 MB',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"path":"user.json","tags":[{"key":"content","value":"text"}]}',
  allowsDuration: true,
};

export const getDocumentReplaceUploadApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /upload',
  description:
    'Returns a URL that can be used to upload documents for a specific documentId (required for documents larger than 5 MB)',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  allowsDuration: true,
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
};

export const deleteFolderApiItem = {
  method: 'DELETE',
  path: '/indices/folder/ INDEX_KEY ',
  description: 'Performs a delete of a key from the folder index',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresIndexKey: true,
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
};

export const documentFulltextSearch = {
  method: 'POST',
  path: '/searchFulltext',
  description:
    'Document full text search (and more robust multi-tag search queries, powered by OpenSearch)',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresPostJson: true,
  defaultPostJsonValue: '{"query":{"text":"abc*","page":1}}',
  allowsLimit: true,
  hasPagingTokens: true,
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
};

export const getDocumentFulltextApiItem = {
  method: 'GET',
  path: '/documents/ DOCUMENT_ID /fulltext',
  description: "Retrieves an OpenSearch document's details, i.e., metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
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
};

export const deleteDocumentFulltextApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /fulltext',
  description: 'Removes full text search for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
};

export const deleteDocumentFulltextTagApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /fulltext/ TAG_KEY ',
  description: 'Removes a tag from full text search for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
};

export const deleteDocumentFulltextTagValueApiItem = {
  method: 'DELETE',
  path: '/documents/ DOCUMENT_ID /fulltext/ TAG_KEY / TAG_VALUE ',
  description: 'Removes a tag value from full text search for a document',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: true,
  requiresTagKey: true,
};

export const getTagSchemasApiItem = {
  method: 'GET',
  path: '/tagSchemas',
  description: 'Returns the list of tag schemas',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
};

export const postTagSchemasApiItem = {
  method: 'POST',
  path: '/tagSchemas',
  description: 'Creates a new tag schema',
  username: 'Cognito User',
  hasNoParams: false,
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: false,
  requiresWebhookID: false,
  requiresTagKey: false,
  requiresIndexKey: false,
  requiresPostJson: true,
  defaultPostJsonValue:
    '{"name":"My TagSchema","tags":{"required":[{"key": "playerId"},{"key": "casinoId"}],"compositeKeys":[{"key":["casinoId","playerId"]}]}}',
  requiresFileUpload: false,
  requiresIndexType: false,
  allowsVersionKey: false,
  allowsDate: false,
  allowsLimit: false,
  hasPagingTokens: false,
  allowsPath: false,
};

export const getTagSchemaApiItem = {
  method: 'GET',
  path: '/tagSchemas/ TAG_SCHEMA_ID ',
  username: 'Cognito User',
  description: "Retrieves a tag schema's details, i.e., metadata",
  hasNoParams: false,
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: false,
  requiresWebhookID: false,
  requiresTagSchemaID: true,
  requiresTagKey: false,
  requiresIndexKey: false,
  requiresPostJson: false,
  requiresFileUpload: false,
  requiresIndexType: false,
  allowsVersionKey: false,
  allowsDate: false,
  allowsLimit: false,
  hasPagingTokens: false,
  allowsPath: false,
};

export const deleteTagSchemaApiItem = {
  method: 'DELETE',
  path: '/tagSchemas/ TAG_SCHEMA_ID ',
  description: 'Deletes a specific tag schema',
  username: 'Cognito User',
  hasNoParams: false,
  requiresSite: true,
  requiresAuthentication: true,
  requiresDocumentID: false,
  requiresWebhookID: false,
  requiresTagSchemaID: true,
  requiresTagKey: false,
  requiresIndexKey: false,
  requiresPostJson: false,
  requiresFileUpload: false,
  requiresIndexType: false,
  allowsVersionKey: false,
  allowsDate: false,
  allowsLimit: false,
  hasPagingTokens: false,
  allowsPath: false,
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
};

export const getWebhookApiItem = {
  method: 'GET',
  path: '/webhooks/ WEBHOOK_ID ',
  description: "Returns a webhook's details, i.e., its metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWebhookID: true,
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
};

export const getSitesApiItem = {
  method: 'GET',
  path: '/sites',
  description: 'Returns the list of sites that the user has access to',
  username: 'Cognito User',
  requiresAuthentication: true,
};

export const getVersionApiItem = {
  method: 'GET',
  path: '/version',
  description: 'Return the version of FormKiQ',
  username: 'Cognito User',
  hasNoParams: true,
  requiresSite: false,
  requiresAuthentication: true,
};

export const getConfigurationApiItem = {
  method: 'GET',
  path: '/configuration',
  description: 'Returns the current configuration',
  username: 'Cognito User',
  requiresAuthentication: true,
};

export const postConfigurationApiItem = {
  method: 'POST',
  path: '/configuration',
  description: 'Sets the current configuration',
  username: 'Cognito User',
  requiresAuthentication: true,
};

export const getApiKeysApiItem = {
  method: 'GET',
  path: '/configuration/apiKeys',
  descriptino: 'Gets the current api keys',
  username: 'Cognito User',
  requiresAuthentication: true,
};

export const postApiKeysApiItem = {
  method: 'POST',
  path: '/configuration/apiKeys',
  descriptino: 'Sets the current api keys',
  username: 'Cognito User',
  requiresAuthentication: true,
};
export const deleteApiKeyApiItem = {
  method: 'DELETE',
  path: '/configuration/apiKeys/ API_KEY ',
  descriptino: 'Deletes an api key',
  username: 'Cognito User',
  requiresAuthentication: true,
};
