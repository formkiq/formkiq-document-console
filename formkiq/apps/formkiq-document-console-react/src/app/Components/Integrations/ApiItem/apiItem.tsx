import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Mode } from 'vanilla-jsoneditor';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import { ConfigState } from '../../../Store/reducers/config';
import { getFormInput } from '../../../helpers/services/toolService';
import { ArrowBottom, ArrowRight } from '../../Icons/icons';
import { JSONEditorReact } from '../../TextEditors/JsonEditor';

function updateRequestsFromForm(
  state: any,
  setState: any,
  { apiItem, user, documentApi }: any,
  formRef: any,
  requestJsonContent: any,
  setRequestJsonContent: any
) {
  let host = documentApi;
  if (host.substring(host.length - 1) === '/') {
    host = host.substring(0, host.length - 1);
  }
  let path = apiItem.path;
  let postJson = '';

  if (requestJsonContent.text) {
    if (getFormInput(formRef, 'postJson') !== undefined) {
      getFormInput(formRef, 'postJson').value = requestJsonContent.text;
      setRequestJsonContent({ text: requestJsonContent.text });
    }
  } else if (requestJsonContent.json) {
    if (getFormInput(formRef, 'postJson') !== undefined) {
      getFormInput(formRef, 'postJson').value = JSON.stringify(
        requestJsonContent.json
      );
      setRequestJsonContent({ json: requestJsonContent.json });
    }
  }

  if (apiItem.requiresSite) {
    if (
      getFormInput(formRef, 'siteID')?.value &&
      getFormInput(formRef, 'siteID')?.validity?.valid &&
      getFormInput(formRef, 'siteID')?.value.length > 0
    ) {
      if (apiItem.path.indexOf(' SITE_ID ') > -1) {
        path = path.replace(
          ' SITE_ID ',
          getFormInput(formRef, 'siteID')?.value
        );
      }
    }
  }

  if (apiItem.requiresDocumentID) {
    if (getFormInput(formRef, 'documentID')?.validity?.valid) {
      path = path.replace(
        ' DOCUMENT_ID ',
        getFormInput(formRef, 'documentID')?.value
      );
    }
  }
  if (apiItem.requiresTagKey) {
    if (getFormInput(formRef, 'tagKey')?.validity?.valid) {
      path = path.replace(' TAG_KEY ', getFormInput(formRef, 'tagKey')?.value);
    }
  }
  if (apiItem.requiresTagValue) {
    if (getFormInput(formRef, 'tagValue')?.validity?.valid) {
      path = path.replace(
        ' TAG_VALUE ',
        getFormInput(formRef, 'tagValue')?.value
      );
    }
  }
  if (apiItem.requiresIndexKey) {
    if (getFormInput(formRef, 'indexKey')?.validity?.valid) {
      path = path.replace(
        ' INDEX_KEY ',
        getFormInput(formRef, 'indexKey')?.value
      );
    }
  }
  if (apiItem.requiresShareKey) {
    if (getFormInput(formRef, 'shareKey')?.validity?.valid) {
      path = path.replace(
        ' SHARE_KEY ',
        getFormInput(formRef, 'shareKey')?.value
      );
    }
  }
  if (apiItem.requiresVersionKey) {
    if (getFormInput(formRef, 'versionKey')?.validity?.valid) {
      path = path.replace(
        ' VERSION_KEY ',
        getFormInput(formRef, 'versionKey')?.value
      );
    }
  }
  if (apiItem.requiresWebhookID) {
    if (getFormInput(formRef, 'webhookID')?.validity?.valid) {
      path = path.replace(
        ' WEBHOOK_ID ',
        getFormInput(formRef, 'webhookID')?.value
      );
    }
  }

  if (apiItem.requiresRulesetID) {
    if (getFormInput(formRef, 'rulesetID')?.validity?.valid) {
      path = path.replace(
        ' RULESET_ID ',
        getFormInput(formRef, 'rulesetID')?.value
      );
    }
  }

  if (apiItem.requiresRuleID) {
    if (getFormInput(formRef, 'ruleID')?.validity?.valid) {
      path = path.replace(' RULE_ID ', getFormInput(formRef, 'ruleID')?.value);
    }
  }

  if (apiItem.requiresWorkflowID) {
    if (getFormInput(formRef, 'workflowID')?.validity?.valid) {
      path = path.replace(
        ' WORKFLOW_ID ',
        getFormInput(formRef, 'workflowID')?.value
      );
    }
  }

  if (apiItem.requiresCaseID) {
    if (getFormInput(formRef, 'caseID')?.validity?.valid) {
      path = path.replace(
        ' CASE_ID ',
        getFormInput(formRef, 'caseID')?.value
      );
    }
  }

  if (apiItem.requiresTaskID) {
    if (getFormInput(formRef, 'taskID')?.validity?.valid) {
      path = path.replace(
        ' TASK_ID ',
        getFormInput(formRef, 'taskID')?.value
      );
    }
  }

  if (apiItem.requiresNigoID) {
    if (getFormInput(formRef, 'nigoID')?.validity?.valid) {
      path = path.replace(
        ' NIGO_ID ',
        getFormInput(formRef, 'nigoID')?.value
      );
    }
  }

  if (apiItem.requiresQueueId) {
    if (getFormInput(formRef, 'queueId')?.validity?.valid) {
      path = path.replace(
        ' QUEUE_ID ',
        getFormInput(formRef, 'queueId')?.value
      );
    }
  }

  if (apiItem.requiresTagSchemaID) {
    if (getFormInput(formRef, 'tagSchemaID')?.validity?.valid) {
      path = path.replace(
        ' TAG_SCHEMA_ID ',
        getFormInput(formRef, 'tagSchemaID')?.value
      );
    }
  }

  if (apiItem.requiresAttributeKey) {
    if (getFormInput(formRef, 'attributeKey')?.validity?.valid) {
      path = path.replace(
        ' ATTRIBUTE_KEY ',
        getFormInput(formRef, 'attributeKey')?.value
      );
    }
  }

  if (apiItem.requiresAttributeValue) {
    if (getFormInput(formRef, 'attributeValue')?.validity?.valid) {
      path = path.replace(
        ' ATTRIBUTE_VALUE ',
        getFormInput(formRef, 'attributeValue')?.value
      );
    }
  }

  if (apiItem.requiresGroupName) {
    if (getFormInput(formRef, 'groupName')?.validity?.valid) {
      path = path.replace(
        ' GROUP_NAME ',
        getFormInput(formRef, 'groupName')?.value
      );
    }
  }
  if (apiItem.requiresUsername) {
    if (getFormInput(formRef, 'username')?.validity?.valid) {
      path = path.replace(
        ' USERNAME ',
        getFormInput(formRef, 'username')?.value
      );
    }
  }
  if(apiItem.requiresUserOperation) {
    if (getFormInput(formRef, 'userOperation')?.validity?.valid) {
      path = path.replace(
        ' USER_OPERATION ',
        getFormInput(formRef, 'userOperation')?.value
      );
    }
  }
  if(apiItem.requiresClassificationID) {
    if (getFormInput(formRef, 'classificationID')?.validity?.valid) {
      path = path.replace(
        ' CLASSIFICATION_ID ',
        getFormInput(formRef, 'classificationID')?.value
      );
    }
  }
  if(apiItem.requiresMappingID) {
    if (getFormInput(formRef, 'mappingID')?.validity?.valid) {
      path = path.replace(
        ' MAPPING_ID ',
        getFormInput(formRef, 'mappingID')?.value
      );
    }
  }
  if(apiItem.requiresEnvelopeID) {
    if (getFormInput(formRef, 'envelopeID')?.validity?.valid) {
      path = path.replace(
        ' ENVELOPE_ID ',
        getFormInput(formRef, 'envelopeID')?.value
      );
    }
  }


  let httpRequest = apiItem.method + ' ' + path;
  let curlRequest = '';
  const fetchUrl = host + path;
  let fetchQueryString = '';
  const fetchHeaders: any = {};
  let fetchBody = null;
  if (apiItem.method === 'POST') {
    curlRequest = 'curl -X POST "' + host + path;
  } else if (apiItem.method === 'DELETE') {
    curlRequest = 'curl -X DELETE "' + host + path;
  } else {
    curlRequest = 'curl "' + host + path;
  }
  if (apiItem.method === 'GET' || apiItem.method === 'DELETE') {
    const params: Map<string, string> = new Map<string, string>();
    if (
      getFormInput(formRef, 'siteID')?.value &&
      getFormInput(formRef, 'siteID')?.validity?.valid &&
      getFormInput(formRef, 'siteID')?.value.length > 0
    ) {
      if (apiItem.path.indexOf(' SITE_ID ') === -1) {
        params.set('siteId', getFormInput(formRef, 'siteID')?.value);
      }
    }
    if (
      getFormInput(formRef, 'shareKey')?.value &&
      getFormInput(formRef, 'shareKey')?.validity?.valid &&
      getFormInput(formRef, 'shareKey')?.value.length > 0
    ) {
      params.set('shareKey', getFormInput(formRef, 'shareKey')?.value);
    }
    // NOTE: we want this to be ignored for DELETE documents/{id}/versions/{versionKey}
    if (
      getFormInput(formRef, 'versionKey')?.value &&
      getFormInput(formRef, 'versionKey')?.validity?.valid &&
      getFormInput(formRef, 'versionKey')?.value.length > 0 &&
      apiItem.method !== 'DELETE'
    ) {
      params.set('versionKey', getFormInput(formRef, 'versionKey')?.value);
    }
    if (
      getFormInput(formRef, 'indexKey')?.value &&
      getFormInput(formRef, 'indexKey')?.validity?.valid &&
      getFormInput(formRef, 'indexKey')?.value.length > 0
    ) {
      params.set(
        'indexKey',
        encodeURIComponent(getFormInput(formRef, 'indexKey')?.value)
      );
    }
    if (
      getFormInput(formRef, 'duration')?.value &&
      getFormInput(formRef, 'duration')?.validity?.valid &&
      getFormInput(formRef, 'duration')?.value.length > 0
    ) {
      params.set('duration', getFormInput(formRef, 'duration')?.value);
    }
    if (
      getFormInput(formRef, 'contentUrl')?.value &&
      getFormInput(formRef, 'contentUrl')?.validity?.valid &&
      getFormInput(formRef, 'contentUrl')?.value.length > 0
    ) {
      params.set('contentUrl', getFormInput(formRef, 'contentUrl')?.value);
    }
    if (
      getFormInput(formRef, 'text')?.value &&
      getFormInput(formRef, 'text')?.validity?.valid &&
      getFormInput(formRef, 'text')?.value.length > 0
    ) {
      params.set('text', getFormInput(formRef, 'text')?.value);
    }
    if (
      getFormInput(formRef, 'date')?.value &&
      getFormInput(formRef, 'date')?.validity?.valid &&
      getFormInput(formRef, 'date')?.value.length > 0
    ) {
      params.set('date', getFormInput(formRef, 'date')?.value);
      if (
        getFormInput(formRef, 'tz')?.value &&
        getFormInput(formRef, 'tz')?.validity?.valid &&
        getFormInput(formRef, 'tz')?.value.length > 0
      ) {
        params.set('tz', getFormInput(formRef, 'tz')?.value);
      }
    }
    if (
      getFormInput(formRef, 'limit')?.value &&
      getFormInput(formRef, 'limit')?.validity?.valid &&
      getFormInput(formRef, 'limit')?.value.length > 0
    ) {
      params.set('limit', getFormInput(formRef, 'limit')?.value);
    }
    if (
      getFormInput(formRef, 'previous')?.value &&
      getFormInput(formRef, 'previous')?.validity?.valid &&
      getFormInput(formRef, 'previous')?.value.length > 0
    ) {
      params.set('prev', getFormInput(formRef, 'previous')?.value);
    }
    if (
      getFormInput(formRef, 'next')?.value &&
      getFormInput(formRef, 'next')?.validity?.valid &&
      getFormInput(formRef, 'next')?.value.length > 0
    ) {
      params.set('next', getFormInput(formRef, 'next')?.value);
    }
    if (
      getFormInput(formRef, 'inline')?.value &&
      getFormInput(formRef, 'inline')?.validity?.valid &&
      getFormInput(formRef, 'inline')?.value.length > 0
    ) {
      params.set('inline', getFormInput(formRef, 'inline')?.value);
    }
    if (
      getFormInput(formRef, 'path')?.value &&
      getFormInput(formRef, 'path')?.validity?.valid &&
      getFormInput(formRef, 'path')?.value.length > 0
    ) {
      params.set('path', getFormInput(formRef, 'path')?.value);
    }
    if (params.size > 0) {
      let queryString = '';
      params.forEach((value: string, key: string) => {
        if (queryString.length === 0) {
          queryString += '?';
        } else {
          queryString += '&';
        }
        queryString += key + '=' + value;
      });
      httpRequest += queryString;
      fetchQueryString = queryString;
      setState({ ...state, queryString: queryString });
      curlRequest += queryString;
    }
  } else if (
    apiItem.method === 'POST' ||
    apiItem.method === 'PATCH' ||
    apiItem.method === 'PUT'
  ) {
    const params: Map<string, string> = new Map<string, string>();
    if (
      getFormInput(formRef, 'siteID')?.value &&
      getFormInput(formRef, 'siteID')?.validity?.valid &&
      getFormInput(formRef, 'siteID')?.value.length > 0
    ) {
      params.set('siteId', getFormInput(formRef, 'siteID')?.value);
    }
    if (
      getFormInput(formRef, 'shareKey')?.value &&
      getFormInput(formRef, 'shareKey')?.validity?.valid &&
      getFormInput(formRef, 'shareKey')?.value.length > 0
    ) {
      params.set('shareKey', getFormInput(formRef, 'shareKey')?.value);
    }
    if (
      getFormInput(formRef, 'duration')?.value &&
      getFormInput(formRef, 'duration')?.validity?.valid &&
      getFormInput(formRef, 'duration')?.value.length > 0
    ) {
      params.set('duration', getFormInput(formRef, 'duration')?.value);
    }
    if (
      getFormInput(formRef, 'limit')?.value &&
      getFormInput(formRef, 'limit')?.validity?.valid &&
      getFormInput(formRef, 'limit')?.value.length > 0
    ) {
      params.set('limit', getFormInput(formRef, 'limit')?.value);
    }
    if (
      getFormInput(formRef, 'previous')?.value &&
      getFormInput(formRef, 'previous')?.validity?.valid &&
      getFormInput(formRef, 'previous')?.value.length > 0
    ) {
      params.set('prev', getFormInput(formRef, 'previous')?.value);
    }
    if (
      getFormInput(formRef, 'next')?.value &&
      getFormInput(formRef, 'next')?.validity?.valid &&
      getFormInput(formRef, 'next')?.value.length > 0
    ) {
      params.set('next', getFormInput(formRef, 'next')?.value);
    }

    if (
      getFormInput(formRef, 'webSocket')?.value &&
      getFormInput(formRef, 'webSocket')?.validity?.valid
    ) {
      params.set('ws', getFormInput(formRef, 'webSocket')?.checked);
    }

    if (getFormInput(formRef, 'postJson')?.validity?.valid) {
      postJson = getFormInput(formRef, 'postJson')?.value;
    } else if (apiItem.requiresIndexType) {
      const indexType = getFormInput(formRef, 'indexType')?.value;
      if (indexType) {
        postJson = `{indexType: "${indexType}"}`;
      }
    } else if (apiItem.requiresVersionKey) {
      const versionKey = getFormInput(formRef, 'versionKey')?.value;
      if (versionKey) {
        postJson = `{versionKey: "${versionKey}"}`;
      }
    } else if (
      apiItem.requiresParseTypes &&
      apiItem.requiresAddPdfDetectedCharactersAsText
    ) {
      const parseTypesSelectOptions: HTMLOptionsCollection = getFormInput(
        formRef,
        'parseTypes'
      ).options;
      const parseTypes: string[] = [];
      if (parseTypesSelectOptions) {
        Array.from(parseTypesSelectOptions).forEach(
          (option: HTMLOptionElement) => {
            if (option.selected) {
              parseTypes.push(option.value);
            }
          }
        );
      }
      const addPdfDetectedCharactersAsText = getFormInput(
        formRef,
        'addPdfDetectedCharactersAsText'
      )?.value;
      if (parseTypes.length && addPdfDetectedCharactersAsText.length) {
        postJson = `{parseTypes: ${JSON.stringify(
          parseTypes
        )}, addPdfDetectedCharactersAsText: addPdfDetectedCharactersAsText}`;
      }
    } else if (apiItem.requiresContent && apiItem.requiresIsBase64) {
      const contentType = getFormInput(formRef, 'contentType')?.value;
      const isBase64 = getFormInput(formRef, 'isBase64')?.value;
      const content = getFormInput(formRef, 'content')?.value;
      if (contentType) {
        postJson = `{contentType: "${contentType}", isBase64: ${isBase64}, content: "${content}"}`;
      } else {
        postJson = `{isBase64: ${isBase64}, content: "${content}"}`;
      }
    } else if (
      apiItem.requiresContentOrContentUrls ||
      apiItem.allowsContentOrContentUrls
    ) {
      const contentType = getFormInput(formRef, 'contentType')?.value;
      const content = getFormInput(formRef, 'content')?.value;
      const contentUrls = getFormInput(formRef, 'contentUrls')?.value;
      const tagJson = getFormInput(formRef, 'tagJson')?.value;
      postJson = `{`;
      if (contentType) {
        postJson += `contentType: "${contentType}"`;
      }
      if (content) {
        if (postJson.length > 1) {
          postJson += ',';
        }
        postJson += `content: "${content}"`;
      }
      if (contentUrls) {
        if (postJson.length > 1) {
          postJson += ',';
        }
        postJson += `contentUrls: ${contentUrls}`;
      }
      if (tagJson) {
        if (postJson.length > 1) {
          postJson += ',';
        }
        postJson += `tags: ${tagJson}`;
      }
      postJson += `}`;
    } else if (apiItem.requiresName || apiItem.allowsName) {
      const name = getFormInput(formRef, 'name')?.value;
      const ttl = getFormInput(formRef, 'ttl')?.value;
      const enabled = getFormInput(formRef, 'enabled')?.value;
      const tagJson = getFormInput(formRef, 'tagJson')?.value;
      postJson = `{`;
      if (name) {
        postJson += `name: "${name}"`;
      }
      if (ttl) {
        if (postJson.length > 1) {
          postJson += ',';
        }
        postJson += `ttl: "${ttl}"`;
      }
      if (enabled) {
        if (postJson.length > 1) {
          postJson += ',';
        }
        postJson += `enabled: enabled`;
      }
      if (tagJson) {
        if (postJson.length > 1) {
          postJson += ',';
        }
        postJson += `tags: ${tagJson}`;
      }
      postJson += `}`;
    }
    if (params.size > 0) {
      let queryString = '';
      params.forEach((value: string, key: string) => {
        if (queryString.length === 0) {
          queryString += '?';
        } else {
          queryString += '&';
        }
        queryString += key + '=' + value;
      });
      httpRequest += queryString;
      fetchQueryString = queryString;
      setState({ ...state, queryString: queryString });
      curlRequest += queryString;
    }
  }
  curlRequest += '" ';
  httpRequest += ' HTTP/1.1\nHost: ' + host.replace(/(^\w+:|^)\/\//, '');
  curlRequest += '-H ';
  if (apiItem.requiresAuthentication) {
    httpRequest += '\r\nAuthorization: ' + user.accessToken;
    curlRequest += '"Authorization: ' + user.accessToken + '" ';
    fetchHeaders.Authorization = user.accessToken;
  }
  if (postJson.length > 0) {
    fetchBody = postJson;
    const res = `\r\n\r\n${postJson} -d "${postJson.replace(/"/g, '\\"')}"`;
    setState({
      ...state,
      postJson: res,
    });
    httpRequest += '\r\n\r\n' + postJson;
    curlRequest += `-d "${postJson.replace(/"/g, '\\"')}"`;
  }
  const fetchRequest = {
    method: apiItem.method,
    url: fetchUrl,
    headers: fetchHeaders,
    queryString: fetchQueryString,
    body: fetchBody,
  };
  const newState = {
    ...state,
    httpRequest: httpRequest,
    curlRequest: curlRequest,
    fetchRequest: fetchRequest,
  };
  setState(newState);
  updateFormValidity(newState, setState, formRef);
}

function itemHeader(isOpened: boolean, setOpened: any, apiItem: any) {
  const onHeaderClick = () => {
    setOpened(!isOpened);
  };
  return (
    <div className={(isOpened ? '' : 'mb-4') + ' w-full'}>
      <h4
        onClick={onHeaderClick}
        className={
          (isOpened
            ? 'text-primary-500 text-lg '
            : 'text-gray-900 hover:text-primary-500 text-base ') +
          ' ml-2 tracking-normal leading-10 font-bold cursor-pointer'
        }
      >
        <span>{apiItem.method} </span>
        <span>{apiItem.path}</span>
        {apiItem.showDeprecationMessage && (
          <span className="text-red-500">(deprecated)</span>
        )}
        {apiItem.license === 'Core' && (
          <span className="mx-2 p-1 bg-primary-500 text-white uppercase text-xs">
            {apiItem.license}
          </span>
        )}
        {apiItem.license === 'Pro|Enterprise' && (
          <>
            <span className="ml-2 mr-1 p-1 bg-proTeal-500 text-white uppercase text-xs">
              Pro
            </span>
            <span className="ml-1 mr-2 p-1 bg-enterpriseBlue-500 text-white uppercase text-xs">
              Enterprise
            </span>
          </>
        )}
        {!isOpened ? <ArrowRight /> : <ArrowBottom />}
      </h4>
    </div>
  );
}
function updateFormValidity(state: any, setState: any, formRef: any) {
  let res = true;
  for (const el of formRef.current) {
    if (!el.validity?.valid) {
      res = false;
    }
    if (el.name === 'postJson') {
      try {
        JSON.parse(el.value);
      } catch (e) {
        console.log(el);
        console.log(e);
        res = false;
      }
    }
  }
  setState({
    ...state,
    isValidForm: res,
  });
}

function getApiItem(
  props: any,
  state: any,
  setState: any,
  formRef: any,
  requestJsonContent: any,
  setRequestJsonContent: any,
  requestEditorMode: any,
  setRequestEditorMode: any,
  responseEditorMode: any,
  setResponseEditorMode: any
) {
  const { apiItem, sites } = props;
  const onFormChange = (ev: any) => {
    updateRequestsFromForm(
      state,
      setState,
      props,
      formRef,
      requestJsonContent,
      setRequestJsonContent
    );
  };
  const onTabClick = (tab: string) => () => {
    setState({ ...state, currentRequestTab: tab });
  };

  const handleJsonChange = (value: any) => {
    if (value.text) {
      if (getFormInput(formRef, 'postJson') !== undefined) {
        getFormInput(formRef, 'postJson').value = value.text;
        updateRequestsFromForm(
          state,
          setState,
          props,
          formRef,
          value,
          setRequestJsonContent
        );
      }
    } else if (value.json) {
      if (getFormInput(formRef, 'postJson') !== undefined) {
        getFormInput(formRef, 'postJson').value = JSON.stringify(value.json);
        updateRequestsFromForm(
          state,
          setState,
          props,
          formRef,
          value,
          setRequestJsonContent
        );
      }
    }
  };

  const handleRequestEditorModeChange = (value: any) => {
    setRequestEditorMode(value);
  };

  const handleResponseEditorModeChange = (value: any) => {
    setResponseEditorMode(value);
  };

  const renderResponseStatusClasses = (responseStatus: number) => {
    switch (responseStatus) {
      case 200:
      case 201:
      case 202:
      case 204:
      case 206:
        return 'bg-green-400';
      case 301:
      case 302:
      case 303:
      case 304:
      case 307:
      case 308:
        return 'bg-yellow-400';
      case 400:
      case 401:
      case 403:
      case 404:
        return 'bg-red-400';
      case 402:
        return 'bg-orange-400';
    }
    return 'bg-gray-400';
  };
  const onFetchClick = (state: any) => () => {
    if (state.isValidForm && state.fetchRequest) {
      setState({ ...state, loading: true });
      let body = {};
      if (state.fetchRequest.body && state.fetchRequest.body.length) {
        if (typeof state.fetchRequest.body === 'string') {
          body = state.fetchRequest.body;
        } else if (typeof state.fetchRequest.body === 'object') {
          body = JSON.stringify(state.fetchRequest.body);
        }
      }
      const options: RequestInit = {
        method: state.fetchRequest.method,
        headers: state.fetchRequest.headers,
      };
      if (
        state.fetchRequest.method !== 'GET' &&
        state.fetchRequest.method !== 'HEAD'
      ) {
        options.body = body as BodyInit;
      }
      let fetchResponse;
      let fetchResponseStatus;
      fetch(state.fetchRequest.url + state.fetchRequest.queryString, options)
        .then((r) =>
          r.json().then((data) => ({ httpStatus: r.status, body: data }))
        )
        .then((obj) => {
          fetchResponse = obj.body;
          fetchResponseStatus = obj.httpStatus;
          setState({
            ...state,
            responseData: JSON.stringify(fetchResponse),
            responseStatus: fetchResponseStatus,
            loading: false,
          });
        });
    }
  };

  return (
    <div className="flex flex-col">
      {apiItem.description && apiItem.description.length && (
        <div className="ml-2 w-2/3 font-bold text-lg text-primary-500 mb-4">
          <h3>{apiItem.description}</h3>
          {apiItem.showDeprecationMessage && (
            <>
              <h4 className="mt-2 text-base font-extrabold text-red-500">
                {apiItem.deprecationMessage.length ? (
                  <span>{apiItem.deprecationMessage}</span>
                ) : (
                  <span>Deprecated.</span>
                )}
              </h4>
            </>
          )}
        </div>
      )}
      <ul className="mt-4 md:grid md:grid-cols-2 md:col-gap-4 md:row-gap-4">
        <li className="relative mr-6">
          <form ref={formRef} onChange={onFormChange}>
            {apiItem.requiresSite && (
              <>
                <div>
                  <h6 className="w-full ml-4 my-2 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
                    Site
                  </h6>
                </div>
                <div className="md:flex md:items-center ml-2 mb-4 relative">
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                      Site ID
                    </label>
                  </div>
                  <div className="w-full md:w-3/4">
                    <select
                      aria-label="Site ID"
                      name="siteID"
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                    >
                      {sites &&
                        sites.map((site: any, i: number) => {
                          return (
                            <option key={i} value={site.siteId}>
                              {site.siteId}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </>
            )}
            {apiItem.requiresAuthentication && (
              <>
                <div>
                  <h6 className="w-full ml-4 mt-4 mb-2 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
                    Authentication
                  </h6>
                </div>
                <div className="md:flex md:items-center ml-2 mb-4 relative">
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                      Auth
                    </label>
                  </div>
                  <div className="w-full md:w-3/4">
                    <select
                      aria-label="Authentication"
                      name="authentication"
                      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                    >
                      <option>{apiItem.username}</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            {!apiItem.hasNoParams && (
              <div>
                <h6 className="w-full ml-4 mt-4 mb-2 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
                  Parameters
                </h6>
              </div>
            )}
            {apiItem.requiresShareKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Share Key
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Share Key"
                    name="shareKey"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.allowsShareKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Share Key
                    <small className="block">
                      Provides access within the specified site via a share
                    </small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Share Key"
                    name="shareKey"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresDocumentID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Document ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Document ID"
                    name="documentID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresWebhookID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Webhook ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Webhook ID"
                    name="webhookID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresWorkflowID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Workflow ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Workflow ID"
                    name="workflowID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresCaseID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Case ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Case ID"
                    name="caseID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresTaskID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Task ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Task ID"
                    name="taskID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresNigoID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    NIGO ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="NIGO ID"
                    name="nigoID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresQueueId && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Queue ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Queue ID"
                    name="queueId"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresClassificationID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Classification ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Tag Schema ID"
                    name="classificationID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresMappingID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Mapping ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Mapping ID"
                    name="mappingID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresEnvelopeID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Envelope ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Envelope ID"
                    name="envelopeID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresTagKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Tag Key
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Tag Key"
                    name="tagKey"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresTagValue && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Tag Value
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Tag Value"
                    name="tagValue"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresIndexKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Index Key
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Index Key"
                    name="indexKey"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.allowsIndexKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Index Key
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Index Key"
                    name="indexKey"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresVersionKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Version Key
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Version Key"
                    name="versionKey"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.allowsInline && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Inline
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Inline"
                    name="inline"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                </div>
              </div>
            )}

            {apiItem.requiresPostJson && (
              <div className="flex flex-wrap items-center justify-start ml-4 mb-4 relative">
                <div className="w-full">
                  <label className="block w-full mt-4 mb-2 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
                    JSON to POST/PATCH
                  </label>
                </div>
                <div className="w-full">
                  <JSONEditorReact
                    content={requestJsonContent}
                    mode={requestEditorMode}
                    onChange={handleJsonChange}
                    onChangeMode={handleRequestEditorModeChange}
                  />
                  <textarea
                    aria-label="JSON to POST/PATCH"
                    name="postJson"
                    defaultValue={apiItem.defaultPostJsonValue}
                    className="hidden appearance-none font-mono rounded-md relative block w-full h-72 px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  ></textarea>
                </div>
              </div>
            )}

            {apiItem.allowsVersionKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Version Key
                    <small className="block">
                      Optional value to retrieve a previous version
                    </small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Version Key"
                    name="versionKey"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.allowsDuration && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Duration
                    <small className="block">
                      Indicates the number of hours request is valid for
                    </small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Duration"
                    name="duration"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.allowsContentUrl && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Content URL?
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Content URL?"
                    name="contentUrl"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div>
              </div>
            )}

            {apiItem.allowsRawText && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Return as Raw Text?
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Return as Raw Text?"
                    name="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                </div>
              </div>
            )}

            {apiItem.allowsDate && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Date
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Date (YYYY-MM-dd)"
                    name="date"
                    type="date"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.allowsDate && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Timezone Offset
                    <small className="block">(e.g., -0500)</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Timezone Offset"
                    name="tz"
                    type="text"
                    // pattern="(([+-]?)(\\d{2}):?(\\d{0,2}))"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresFileUpload && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    File to Upload
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="File to Upload"
                    name="fileUpload"
                    type="file"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresIndexType && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Type of Index
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Index Type"
                    name="indexType"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="folder">folder</option>
                    <option value="tag">tag</option>
                  </select>
                </div>
              </div>
            )}

            {apiItem.requiresParseTypes && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Parse Types
                    <small className="block">For Amazon Textract</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Parse Types"
                    name="parseTypes"
                    multiple
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="FORMS">FORMS</option>
                    <option value="TABLES">TABLES</option>
                  </select>
                </div>
              </div>
            )}

            {apiItem.requiresAddPdfDetectedCharactersAsText && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Add OCR Results as Text to the PDF?
                    <small className="block">
                      Creates a searchable PDF File
                    </small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Parse Types"
                    name="addPdfDetectedCharactersAsText"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                </div>
              </div>
            )}

            {(apiItem.requiresName || apiItem.allowsName) && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Name
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Name"
                    name="name"
                    type="text"
                    required={
                      apiItem.requiresName && apiItem.requiresName.length
                    }
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.allowsTtl && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Time to Live
                    <small className="block">(expiry in seconds)</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Time to Live"
                    name="ttl"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresEnabled && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Enabled?
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Enabled?"
                    name="enabled"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div>
              </div>
            )}

            {(apiItem.requiresContentType || apiItem.allowsContentType) && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Content Type
                    <small className="block">e.g., application/pdf</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Content Type"
                    name="contentType"
                    type="text"
                    required={
                      apiItem.requiresContentType &&
                      apiItem.requiresContentType.length
                    }
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresContent && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Content
                    <small className="block">(text to add as OCR result)</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <textarea
                    aria-label="Content"
                    name="content"
                    required
                    className="appearance-none font-mono rounded-md relative block w-full h-72 px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  ></textarea>
                </div>
              </div>
            )}

            {(apiItem.requiresContentOrContentUrls ||
              apiItem.allowsContentOrContentUrls) && (
              <>
                <div className="md:flex md:items-center mx-4 mb-4 relative">
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                      Content
                      <small className="block">
                        (text for fulltext content search)
                      </small>
                    </label>
                  </div>
                  <div className="w-full md:w-3/4">
                    <textarea
                      aria-label="Content"
                      name="content"
                      className="appearance-none font-mono rounded-md relative block w-full h-72 px-3 py-3 border border-gray-600
                          placeholder-gray-500 text-gray-900 rounded-t-md
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                    ></textarea>
                  </div>
                </div>
                <div className="md:flex md:items-center mx-4 mb-4 relative">
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                      Content URL(s)
                      <small className="block">
                        (one or more URLs with content - matches output of OCR,
                        specified as an array of strings)
                      </small>
                    </label>
                  </div>
                  <div className="w-full md:w-3/4">
                    <textarea
                      aria-label="Content URL(s)"
                      name="contentUrls"
                      placeholder="['{URL-1}','{URL-2}']"
                      className="appearance-none font-mono rounded-md relative block w-full h-48 px-3 py-3 border border-gray-600
                          placeholder-gray-500 text-gray-900 rounded-t-md
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            {apiItem.requiresIsBase64 && (
              <div className="md:flex md:items-center ml-2 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Is Content Base64-Encoded?
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <select
                    aria-label="Is Content Base64-Encoded?"
                    name="isBase64"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                </div>
              </div>
            )}

            {apiItem.allowsTagJson && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    JSON for Tags
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <textarea
                    aria-label="JSON for Tags"
                    name="tagJson"
                    defaultValue={apiItem.defaultTagJsonValue}
                    className="appearance-none font-mono rounded-md relative block w-full h-72 px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  ></textarea>
                </div>
              </div>
            )}

            {apiItem.allowsLimit && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Limit
                    <small className="block">(number)</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Limit (number)"
                    name="limit"
                    type="number"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.hasPagingTokens && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Previous
                    <small className="block">(paging token)</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Previous (paging token)"
                    name="previous"
                    type="text"
                    minLength={6}
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {(apiItem.hasPagingTokens || apiItem.hasOnlyNextPagingToken) && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Next
                    <small className="block">(paging token)</small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Next (paging token)"
                    name="next"
                    type="text"
                    minLength={6}
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                        placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.allowsPath && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Path
                    <small className="block">
                      must url encode - only following characters allowed: A-Z
                      a-z 0-9 - _ . ! ~ * ' ( )
                    </small>
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Path"
                    name="path"
                    type="text"
                    pattern="^[A-Za-z0-9._%!~*()\'-]*$"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresObjectID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    OBJECT ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="OBJECT ID"
                    name="objectID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresRulesetID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Ruleset ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Ruleset ID"
                    name="rulesetID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
            placeholder-gray-500 text-gray-900 rounded-t-md
            focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresRuleID && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Rule ID
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="Rule ID"
                    name="ruleID"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
            placeholder-gray-500 text-gray-900 rounded-t-md
            focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresAttributeKey && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    ATTRIBUTE KEY
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="ATTRIBUTE KEY"
                    name="attributeKey"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresAttributeValue && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    ATTRIBUTE VALUE
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="ATTRIBUTE VALUE"
                    name="attributeValue"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresGroupName && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    GROUP NAME
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="GROUP NAME"
                    name="groupName"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}
            {apiItem.requiresUsername && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    USERNAME
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="USERNAME"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresUserOperation && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full md:w-1/4">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    USER OPERATION
                  </label>
                </div>
                <div className="w-full md:w-3/4">
                  <input
                    aria-label="USER OPERATION"
                    name="userOperation"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                  />
                </div>
              </div>
            )}

            {apiItem.requiresWS && (
              <div className="md:flex md:items-center mx-4 mb-4 relative">
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
                    Enable WebSocket real-time communication with the request
                  </label>
                </div>
                <input
                  aria-label="WEB SOCKET"
                  name="webSocket"
                  type="checkbox"
                  className="appearance-none rounded-md relative block px-3 py-3 border border-gray-600
                      placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
                />
              </div>
            )}
          </form>
        </li>
        <li className="relative mt-10 sm:mt-2 md:mt-0">
          <div className="flex flex-rows w-full">
            <div className="grow-0">
              <h6 className="ml-4 mr-4 mb-4 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
                Request
              </h6>
            </div>
            <div className="grow text-right mt-2 mb-2 relative"></div>
          </div>
          <div className="md:flex md:items-center mx-4 mb-4 relative">
            <div className="md:w-full">
              <ul className="list-reset flex border-b">
                <li className="-mb-px mr-1">
                  <a
                    data-test-id="apiItem-HTTP"
                    className={`inline-block cursor-pointer border-l border-t border-r rounded-t py-2 px-4 text-blue-dark font-semibold
                      ${
                        state.currentRequestTab === 'http'
                          ? 'font-bold text-red-600 cursor-text'
                          : ''
                      }`}
                    onClick={onTabClick('http')}
                  >
                    HTTP
                  </a>
                </li>
                <li className="-mb-px mr-1">
                  <a
                    data-test-id="apiItem-cURL"
                    className={`inline-block cursor-pointer border-l border-t border-r rounded-t py-2 px-4 text-blue-dark font-semibold
                      ${
                        state.currentRequestTab === 'curl'
                          ? 'font-bold text-red-600 cursor-text'
                          : ''
                      }`}
                    onClick={onTabClick('curl')}
                  >
                    cURL
                  </a>
                </li>
              </ul>
              <textarea
                aria-label="HTTP Request"
                id="http-textarea"
                rows={8}
                readOnly={true}
                value={state.httpRequest}
                className={`appearance-none rounded-md text-sm relative block w-full px-3 py-3 border border-gray-600
                      font-mono placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 ${
                        state.currentRequestTab === 'curl' ? 'hidden' : ''
                      }`}
              ></textarea>
              <textarea
                aria-label="cURL Request"
                id="curl-textarea"
                data-test-id="apiItem-curl-request"
                rows={8}
                readOnly={true}
                value={state.curlRequest}
                className={`appearance-none rounded-md text-sm relative block w-full px-3 py-3 border border-gray-600
                      font-mono placeholder-gray-500 text-gray-900 rounded-t-md
                      focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 ${
                        state.currentRequestTab === 'http' ? 'hidden' : ''
                      }`}
              ></textarea>
            </div>
          </div>
          <div className="ml-4">
            <button
              data-test-id="apiItem-fetch"
              className={`px-2 md:px-4 font-semibold px-4 py-1 rounded-md
                  ${
                    state.isValidForm
                      ? 'cursor-pointer bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white'
                      : 'cursor-default bg-gray-200 text-gray-400'
                  }`}
              onClick={onFetchClick(state)}
            >
              Fetch
            </button>
          </div>
          <div className="md:flex md:items-center mx-4 mb-4 relative">
            <div className="md:w-full">
              <div>
                <div className="lds-ellipsis">
                  <div className="bg-orange-600"></div>
                  <div className="bg-orange-600"></div>
                  <div className="bg-orange-600"></div>
                  <div className="bg-orange-600"></div>
                </div>
              </div>

              {state.responseStatus && (
                <div
                  data-test-id="apiItem-response-status"
                  className={
                    renderResponseStatusClasses(state.responseStatus) +
                    ' mt-4 p-2 rounded-md border font-semibold text-xl'
                  }
                >
                  {state.responseStatus}
                </div>
              )}
              {state.responseData && (
                <div>
                  <h6 className="mr-4 mt-4 mb-2 md:mb-4 text-base tracking-normal leading-10 font-bold text-gray-900 sm:leading-none">
                    Response
                  </h6>
                  <div className="h-72 mb-[-56px]">
                    <JSONEditorReact
                      content={{
                        json: JSON.parse(state.responseData),
                        text: undefined,
                      }}
                      mode={responseEditorMode}
                      onChangeMode={handleResponseEditorModeChange}
                      readOnly={true}
                    />
                  </div>
                  <textarea
                    aria-label="Response"
                    data-test-id="apiItem-response-data"
                    id="response-textarea"
                    rows={8}
                    readOnly={true}
                    value={state.responseData}
                    className={`hidden appearance-none rounded-md text-small text-mono relative block w-full px-3 py-3 border border-gray-600
                        font-mono placeholder-gray-500 text-gray-900 rounded-t-md
                        focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 ${
                          state.isErrorResponse ? 'bg-red-200' : ''
                        }`}
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export function ApiItem(props: { apiItem: any; sites: any[] }) {
  const [isOpened, setOpened] = useState(false);

  const { documentApi } = useSelector(ConfigState);
  const { user } = useAuthenticatedState();
  const [state, setState] = useState({
    httpRequest: '',
    curlRequest: '',
    queryString: '',
    currentRequestTab: 'http',
    isErrorResponse: false,
    isValidForm: false,
  });
  const formRef = useRef(null);
  let formattedJson = '';
  if (
    props.apiItem.defaultPostJsonValue &&
    props.apiItem.defaultPostJsonValue.length
  ) {
    let jsonObject;
    try {
      jsonObject = JSON.parse(props.apiItem.defaultPostJsonValue);
    } catch (e: any) {
      console.log('invalid JSON object');
    }
    if (jsonObject) {
      formattedJson = JSON.stringify(jsonObject, null, 2);
    } else {
      formattedJson = props.apiItem.defaultPostJsonValue;
    }
  }

  const [requestJsonContent, setRequestJsonContent] = useState({
    text: formattedJson,
    json: undefined,
  });

  const [requestEditorMode, setRequestEditorMode] = useState(Mode.text);
  const [responseEditorMode, setResponseEditorMode] = useState(Mode.text);
  useEffect(() => {
    if (formRef?.current) {
      updateRequestsFromForm(
        state,
        setState,
        { ...props, user, documentApi },
        formRef,
        requestJsonContent,
        setRequestJsonContent
      );
    }
  }, []);

  const apiItemName = props.apiItem.method + props.apiItem.path;
  return (
    <div
      className="w-full flex flex-col lg:flex-col"
      data-test-id={`apiItem-${apiItemName}`}
    >
      {itemHeader(isOpened, setOpened, props.apiItem)}
      <div className={`${isOpened ? '' : 'hidden'} border-b mb-2`}>
        {getApiItem(
          {
            documentApi,
            user,
            ...props,
          },
          state,
          setState,
          formRef,
          requestJsonContent,
          setRequestJsonContent,
          requestEditorMode,
          setRequestEditorMode,
          responseEditorMode,
          setResponseEditorMode
        )}
      </div>
    </div>
  );
}

export default ApiItem;
