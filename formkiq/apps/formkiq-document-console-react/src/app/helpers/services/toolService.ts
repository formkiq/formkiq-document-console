import { IDocument } from './../types/document';
import { IDocumentTag } from './../types/documentTag';
import { IFolder } from './../types/folder';
import moment from 'moment';
import { User } from '../../Store/reducers/auth';

export function getFileIcon(filename: string) {
  let fileIcon = '';
  if (filename) {
    const extension = filename.split('.').pop();
    switch (extension) {
      case 'png':
        fileIcon = '/assets/img/svg/icon-png.svg';
        break;
      case 'jpg':
      case 'jpeg':
        fileIcon = '/assets/img/svg/icon-jpg.svg';
        break;
      case 'gif':
        fileIcon = '/assets/img/svg/icon-gif.svg';
        break;
      case 'svg':
        fileIcon = '/assets/img/svg/icon-svg.svg';
        break;
      case 'webp':
        fileIcon = '/assets/img/svg/icon-webp.svg';
        break;
      case 'csv':
        fileIcon = '/assets/img/svg/icon-csv.svg';
        break;
      case 'json':
        fileIcon = '/assets/img/svg/icon-json.svg';
        break;
      case 'doc':
        fileIcon = '/assets/img/svg/icon-doc.svg';
        break;
      case 'docx':
        fileIcon = '/assets/img/svg/icon-docx.svg';
        break;
      case 'pdf':
        fileIcon = '/assets/img/svg/icon-pdf.svg';
        break;
      case 'xls':
        fileIcon = '/assets/img/svg/icon-xls.svg';
        break;
      case 'xlsx':
        fileIcon = '/assets/img/svg/icon-xlsx.svg';
        break;
      case 'ppt':
        fileIcon = '/assets/img/svg/icon-ppt.svg';
        break;
      case 'pptx':
        fileIcon = '/assets/img/svg/icon-pptx.svg';
        break;
      case 'txt':
        fileIcon = '/assets/img/svg/icon-txt.svg';
        break;
      case 'html':
      case 'htm':
      case 'xhtml':
      case 'whtml':
        fileIcon = '/assets/img/svg/icon-html.svg';
        break;
      case 'dwg':
        fileIcon = '/assets/img/svg/icon-dwg.svg';
        break;
      default:
        fileIcon = '/assets/img/svg/icon-default.svg';
        break;
    }
  } else {
    fileIcon = '/assets/img/svg/icon-default.svg';
  }
  return fileIcon;
}

export interface IUserSiteInfo {
  hasUserSite: boolean
  hasDefaultSite: boolean
  hasSharedFolders: boolean
  sharedFolderSites: any[]
}

export function getUserSites(userToCheck: any): IUserSiteInfo  {
  const userSiteInfo: IUserSiteInfo = {
    hasUserSite: false,
    hasDefaultSite: false,
    hasSharedFolders: false,
    sharedFolderSites: [] as any[]
  }
  if (userToCheck && userToCheck.sites) {
    userToCheck.sites.forEach((site: any) => {
      if (site.siteId === userToCheck.email) {
        userSiteInfo.hasUserSite = true
      } else if (site.siteId === 'default') {
        userSiteInfo.hasDefaultSite = true
      } else {
        userSiteInfo.hasSharedFolders = true
        userSiteInfo.sharedFolderSites.push(site)
      }
    })
  }
  return userSiteInfo;
}

export interface ICurrentSiteInfo {
  siteId: string
  siteRedirectUrl: string
  siteDocumentsRootUri: string
  siteDocumentsRootName: string
}

export function getCurrentSiteInfo(pathname: string, user: any, hasUserSite: boolean, hasDefaultSite: boolean, hasSharedFolders: boolean, sharedFolderSites: any[]): ICurrentSiteInfo {
  const currentSiteInfo = {
    siteId: '',
    siteRedirectUrl: '',
    siteDocumentsRootUri: '/documents',
    siteDocumentsRootName: 'Documents'
  }
  if (hasUserSite && pathname.indexOf('/documents') === 0) {
    currentSiteInfo.siteId = user.email
    currentSiteInfo.siteRedirectUrl = '/my-documents'
    currentSiteInfo.siteDocumentsRootUri = '/my-documents'
    currentSiteInfo.siteDocumentsRootName = 'My Documents'
  } else if (!hasUserSite && pathname.indexOf('/my-documents') === 0) {
    if (hasDefaultSite || !hasSharedFolders || !sharedFolderSites.length) {
      currentSiteInfo.siteId = 'default'
      currentSiteInfo.siteRedirectUrl = '/documents'
      currentSiteInfo.siteDocumentsRootUri = '/documents'
      currentSiteInfo.siteDocumentsRootName = 'Documents'
    } else if (hasSharedFolders) {
      currentSiteInfo.siteId = sharedFolderSites[0].siteId
      currentSiteInfo.siteRedirectUrl = `/shared-folders/${sharedFolderSites[0].siteId}`
      currentSiteInfo.siteDocumentsRootUri = `/shared-folders/${sharedFolderSites[0].siteId}`
      currentSiteInfo.siteDocumentsRootName = `Shared Folder: ${sharedFolderSites[0].siteId}`
    }
  } else if (!hasUserSite && pathname.indexOf('/team-documents') === 0) {
    if (hasDefaultSite || !hasSharedFolders || !sharedFolderSites.length) {
      currentSiteInfo.siteId = 'default'
      currentSiteInfo.siteRedirectUrl = '/documents'
      currentSiteInfo.siteDocumentsRootUri = '/documents'
      currentSiteInfo.siteDocumentsRootName = 'Documents'
    } else if (hasSharedFolders) {
      currentSiteInfo.siteId = sharedFolderSites[0].siteId
      currentSiteInfo.siteRedirectUrl = `/shared-folders/${sharedFolderSites[0].siteId}`
      currentSiteInfo.siteDocumentsRootUri = `/shared-folders/${sharedFolderSites[0].siteId}`
      currentSiteInfo.siteDocumentsRootName = `Shared Folder: ${sharedFolderSites[0].siteId}`
    }
  }
  if (pathname.indexOf('/my-documents') === 0) {
    currentSiteInfo.siteId = user.email
    currentSiteInfo.siteDocumentsRootUri = '/my-documents'
    currentSiteInfo.siteDocumentsRootName = 'My Documents'
  } else if (pathname.indexOf('/team-documents') === 0) {
    currentSiteInfo.siteId = 'default'
    currentSiteInfo.siteDocumentsRootUri = '/team-documents'
    currentSiteInfo.siteDocumentsRootName = 'Team Documents'
  } else if (pathname.indexOf('/shared-folders') === 0) {
    const pathAfterSharedFolders = pathname.substring(pathname.indexOf('/', 1) + 1)
    if (pathAfterSharedFolders.indexOf('/') > -1) {
      currentSiteInfo.siteId = pathAfterSharedFolders.substring(0, pathAfterSharedFolders.indexOf('/'))
    } else {
      currentSiteInfo.siteId = pathAfterSharedFolders
    }
    if (!currentSiteInfo.siteId.length) {
      if (hasUserSite) {
        currentSiteInfo.siteId = user.email
        currentSiteInfo.siteRedirectUrl = '/my-documents'
        currentSiteInfo.siteDocumentsRootUri = '/my-documents'
        currentSiteInfo.siteDocumentsRootName = 'My Documents'
      } else if (hasDefaultSite) {
          currentSiteInfo.siteId = user.email
          currentSiteInfo.siteRedirectUrl = '/my-documents'
          currentSiteInfo.siteDocumentsRootUri = '/my-documents'
          currentSiteInfo.siteDocumentsRootName = 'My Documents'
      } else {
        currentSiteInfo.siteId = ''
        currentSiteInfo.siteRedirectUrl = '/documents'
        currentSiteInfo.siteDocumentsRootUri = '/documents'
        currentSiteInfo.siteDocumentsRootName = 'Documents'
      }
    }
    currentSiteInfo.siteDocumentsRootUri = `/shared-folders/${currentSiteInfo.siteId}`
    currentSiteInfo.siteDocumentsRootName = `Shared Folder: ${currentSiteInfo.siteId}`
  }
  return currentSiteInfo
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFormInput(formRef: any, inputName: string) {
  let input = null;
  for (const el of formRef.current) {
    if (el['name'] === inputName) {
      input = el;
    }
  }
  return input;
}

export function isTagValueIncludes(
  tagValues: string | [],
  searchValues: string | []
): boolean {
  if (tagValues) {
    if (typeof tagValues === 'string' || tagValues instanceof String) {
      if (typeof searchValues === 'string' || searchValues instanceof String) {
        return tagValues === searchValues;
      } else {
        for (const searchVal of searchValues) {
          if (tagValues === searchVal) {
            return true;
          }
        }
      }
    } else {
      for (const val of tagValues) {
        if (
          typeof searchValues === 'string' ||
          searchValues instanceof String
        ) {
          if (val === searchValues) {
            return true;
          }
        } else {
          for (const searchVal of searchValues) {
            if (val === searchVal) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }
  return false;
}

export function addOrCreateTagValue(
  tagKey: string,
  tagVal: null | string | [],
  newVal: string,
  tags: any
) {
  if (tagVal) {
    if (typeof tagVal === 'string' || tagVal instanceof String) {
      const res = {
        ...tags,
      };
      res[tagKey] = [tagVal, newVal];
      return res;
    } else {
      const res = {
        ...tags,
      };
      res[tagKey] = [...tagVal, newVal];
      return res;
    }
  }
  const res = {
    ...tags,
  };
  res[tagKey] = newVal;
  return res;
}

export function removeTagOrTagValue(
  tagKey: string,
  tagVal: null | string | string[],
  removeVal: string,
  tags: any
) {
  const res = { ...tags };
  if (tagVal) {
    if (typeof tagVal === 'string' || tagVal instanceof String) {
      if (tagVal === removeVal) {
        delete res[tagKey];
        return res;
      }
      return { ...tags };
    } else {
      const index = tagVal.indexOf(removeVal);
      if (index > -1) {
        const newValues = [...tagVal];
        newValues.splice(index, 1);
        if (newValues.length > 1) {
          res[tagKey] = newValues;
        } else {
          res[tagKey] = newValues[0];
        }
      } else {
        return { ...tags };
      }
    }
  }
  return res;
}

export function formatDate(date: string) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

export function findFolderAndParent(
  folderId: string,
  parentFolder: any
): [IFolder, number, any] | [null, null, null] {
  for (let i = 0; i < parentFolder.folders.length; i++) {
    if (parentFolder.folders[i].documentId === folderId) {
      return [parentFolder.folders[i], i, parentFolder];
    } else {
      if (parentFolder.folders[i]?.folders?.length > 0) {
        const subfolderResult = findFolderAndParent(folderId, parentFolder.folders[i])
        // NOTE: if `number` on subfolders is not null, a match has been found that we can return
        if (subfolderResult[1] !== null) {
          return subfolderResult
        }
      }
    }
  }
  return [null, null, null];
}

export function findParentForDocument(
  docId: string,
  parentFolder: any
): [IDocument, number, any] | [null, null, null] {
  for (let j = 0; j < parentFolder.documents?.length; j++) {
    if (parentFolder.documents[j].documentId === docId) {
      return [parentFolder.documents[j], j, parentFolder];
    }
  }

  if (parentFolder.folders) {
    for (const folder of parentFolder.folders) {
      const [document, index, resFolder] = findParentForDocument(docId, folder);
      if (document && resFolder) {
        return [document, index, resFolder];
      }
    }
  }
  return [null, null, null];
}

export function excludeDocumentsWithTagFromAll(
  parentObj: { folders: null | IFolder[]; documents: IDocument[] },
  tagKey: string,
  tagValue: string,
  isSystemDeletedByKey = false
) {
  const res = { ...parentObj };
  const updateDocumentsList = (documents: IDocument[]): IDocument[] => {
    if (documents?.length > 0) {
      const docs = [...documents];
      if (tagValue.length) {
        return (docs as any[]).filter((doc: any) => {
          return !isTagValueIncludes(doc.tags[tagKey], tagValue)
        });
      } else {
        return (docs as any[]).filter((doc: any) => {
          if (isSystemDeletedByKey) {
            return (doc.tags as any)['sysDeletedBy']
          } else {
            return !(doc.tags as any)['sysDeletedBy']
          }
        });
      }
    }
    return documents;
  };
  res.documents = updateDocumentsList(res.documents);
  if (res.folders) {
    const foldersRes = [...res.folders];
    for (let i = 0; i < foldersRes.length; i++) {
      foldersRes[i] = excludeDocumentsWithTagFromAll(
        foldersRes[i],
        tagKey,
        tagValue
      ) as unknown as IFolder;
      foldersRes[i].documents = updateDocumentsList(foldersRes[i].documents);
    }
    res.folders = foldersRes;
  }
  return res;
}

export function parseSubfoldersFromUrl(
  subfolderLevel01: string | undefined,
  subfolderLevel02: string | undefined,
  subfolderLevel03: string | undefined,
  subfolderLevel04: string | undefined,
  subfolderLevel05: string | undefined,
  subfolderLevel06: string | undefined,
  subfolderLevel07: string | undefined,
  subfolderLevel08: string | undefined,
  subfolderLevel09: string | undefined,
  subfolderLevel10: string | undefined
) {
  let subfolderUri = '';
  if (subfolderLevel10) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04 +
      '/' +
      subfolderLevel05 +
      '/' +
      subfolderLevel06 +
      '/' +
      subfolderLevel07 +
      '/' +
      subfolderLevel08 +
      '/' +
      subfolderLevel09 +
      '/' +
      subfolderLevel10;
  } else if (subfolderLevel09) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04 +
      '/' +
      subfolderLevel05 +
      '/' +
      subfolderLevel06 +
      '/' +
      subfolderLevel07 +
      '/' +
      subfolderLevel08 +
      '/' +
      subfolderLevel09;
  } else if (subfolderLevel08) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04 +
      '/' +
      subfolderLevel05 +
      '/' +
      subfolderLevel06 +
      '/' +
      subfolderLevel07 +
      '/' +
      subfolderLevel08;
  } else if (subfolderLevel07) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04 +
      '/' +
      subfolderLevel05 +
      '/' +
      subfolderLevel06 +
      '/' +
      subfolderLevel07;
  } else if (subfolderLevel06) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04 +
      '/' +
      subfolderLevel05 +
      '/' +
      subfolderLevel06;
  } else if (subfolderLevel05) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04 +
      '/' +
      subfolderLevel05;
  } else if (subfolderLevel04) {
    subfolderUri =
      subfolderLevel01 +
      '/' +
      subfolderLevel02 +
      '/' +
      subfolderLevel03 +
      '/' +
      subfolderLevel04;
  } else if (subfolderLevel03) {
    subfolderUri =
      subfolderLevel01 + '/' + subfolderLevel02 + '/' + subfolderLevel03;
  } else if (subfolderLevel02) {
    subfolderUri = subfolderLevel01 + '/' + subfolderLevel02;
  } else if (subfolderLevel01) {
    subfolderUri = subfolderLevel01;
  }
  return subfolderUri
}
