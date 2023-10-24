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
  requiresTagKey: boolean;
  allowsIndexKey: boolean;
  requiresIndexKey: boolean;
  requiresPostJson: boolean;
  requiresFileUpload: boolean;
  requiresIndexType: boolean;
  allowsVersionKey: boolean;
  allowsDate: boolean;
  allowsLimit: boolean;
  hasPagingTokens: boolean;
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
    '{"path":"user.json","content":{"name":"John Smith"},"tags":[{"key":"content","value":"text"}]}',
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

export const getTagSchemasApiItem = {
  method: 'GET',
  path: '/tagSchemas',
  description: 'Returns the list of tag schemas',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  allowsLimit: true,
  hasPagingTokens: true,
  license: 'Pro|Enterprise',
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
  license: 'Pro|Enterprise',
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
  license: 'Pro|Enterprise',
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
  license: 'Pro|Enterprise',
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
  license: 'Core',
};

export const getWorkflowApiItem = {
  method: 'GET',
  path: '/workflows/ WORKFLOW_ID ',
  description: "Returns a workflow's details, i.e., its metadata",
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWorkflowID: true,
  license: 'Core',
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
    '{"name":"Test Workflow","description":"Some description","config":{"notificationType":"none"},"steps":[]}',
  license: 'Core',
};

export const deleteWorkflowApiItem = {
  method: 'DELETE',
  path: '/workflows/ WORKFLOW_ID ',
  description: 'Deletes a workflow',
  username: 'Cognito User',
  requiresSite: true,
  requiresAuthentication: true,
  requiresWorkflowID: true,
  license: 'Core',
};

export const getSitesApiItem = {
  method: 'GET',
  path: '/sites',
  description: 'Returns the list of sites that the user has access to',
  username: 'Cognito User',
  requiresAuthentication: true,
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
  descriptino: 'Deletes an share',
  username: 'Cognito User',
  requiresAuthentication: true,
  requiresSite: true,
  requiresShareKey: true,
  license: 'Pro|Enterprise',
};

postShareFolderApiItem;
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
  path: '/configuration',
  description: 'Returns the current configuration',
  username: 'Cognito User',
  hasNoParams: true,
  requiresAuthentication: true,
  license: 'Core',
};

export const postConfigurationApiItem = {
  method: 'PATCH',
  path: '/configuration',
  description: 'Updates the current configuration',
  username: 'Cognito User',
  requiresPostJson: true,
  requiresAuthentication: true,
  license: 'Core',
};

export const getApiKeysApiItem = {
  method: 'GET',
  path: '/configuration/apiKeys',
  descriptino: 'Gets the current api keys',
  username: 'Cognito User',
  requiresAuthentication: true,
  license: 'Core',
};

export const postApiKeysApiItem = {
  method: 'POST',
  path: '/configuration/apiKeys',
  descriptino: 'Sets the current api keys',
  username: 'Cognito User',
  requiresAuthentication: true,
  license: 'Core',
};
export const deleteApiKeyApiItem = {
  method: 'DELETE',
  path: '/configuration/apiKeys/ API_KEY ',
  descriptino: 'Deletes an api key',
  username: 'Cognito User',
  requiresAuthentication: true,
  license: 'Core',
};
