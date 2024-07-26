import moment from 'moment';
import { IDocument } from './../types/document';
import { IFolder } from './../types/folder';

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
      case 'webm':
        fileIcon = '/assets/img/svg/icon-webm.svg';
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
      case 'rtf':
        fileIcon = '/assets/img/svg/icon-rtf.svg';
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
      case 'ico':
        fileIcon = '/assets/img/svg/icon-ico.svg';
        break;
      case 'mp3':
        fileIcon = '/assets/img/svg/icon-mp3.svg';
        break;
      case 'ogg':
        fileIcon = '/assets/img/svg/icon-ogg.svg';
        break;
      case 'wav':
        fileIcon = '/assets/img/svg/icon-wav.svg';
        break;
      case 'eml':
        fileIcon = '/assets/img/svg/icon-eml.svg';
        break;
      case 'md':
        fileIcon = '/assets/img/svg/icon-md.svg';
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
  hasUserSite: boolean;
  hasDefaultSite: boolean;
  hasWorkspaces: boolean;
  workspaceSites: any[];
}

export function getUserSites(userToCheck: any): IUserSiteInfo {
  const userSiteInfo: IUserSiteInfo = {
    hasUserSite: false,
    hasDefaultSite: false,
    hasWorkspaces: false,
    workspaceSites: [] as any[],
  };
  if (userToCheck && userToCheck.sites) {
    userToCheck.sites.forEach((site: any) => {
      if (site.siteId === userToCheck.email) {
        userSiteInfo.hasUserSite = true;
      } else if (site.siteId === 'default') {
        userSiteInfo.hasDefaultSite = true;
      } else {
        userSiteInfo.hasWorkspaces = true;
        userSiteInfo.workspaceSites.push(site);
      }
    });
  }
  return userSiteInfo;
}

export interface ICurrentSiteInfo {
  siteId: string;
  siteRedirectUrl: string;
  siteDocumentsRootUri: string;
  siteDocumentsRootName: string;
  isSiteReadOnly: boolean;
}

export function getCurrentSiteInfo(
  pathname: string,
  user: any,
  hasUserSite: boolean,
  hasDefaultSite: boolean,
  hasWorkspaces: boolean,
  workspaceSites: any[]
): ICurrentSiteInfo {
  const currentSiteInfo = {
    siteId: '',
    siteRedirectUrl: '',
    siteDocumentsRootUri: '/documents',
    siteDocumentsRootName: 'Documents',
    isSiteReadOnly: false,
  };
  if (hasUserSite && pathname.indexOf('/documents') === 0) {
    currentSiteInfo.siteId = user.email;
    currentSiteInfo.siteRedirectUrl = '/my-documents';
    currentSiteInfo.siteDocumentsRootUri = '/my-documents';
    currentSiteInfo.siteDocumentsRootName = 'My Documents';
  } else if (!hasUserSite && pathname.indexOf('/my-documents') === 0) {
    if (hasDefaultSite || !hasWorkspaces || !workspaceSites.length) {
      currentSiteInfo.siteId = 'default';
      currentSiteInfo.siteRedirectUrl = '/documents';
      currentSiteInfo.siteDocumentsRootUri = '/documents';
      currentSiteInfo.siteDocumentsRootName = 'Documents';
    } else if (hasWorkspaces) {
      currentSiteInfo.siteId = workspaceSites[0].siteId;
      currentSiteInfo.siteRedirectUrl = `/workspaces/${workspaceSites[0].siteId}`;
      currentSiteInfo.siteDocumentsRootUri = `/workspaces/${workspaceSites[0].siteId}`;
      if (hasDefaultSite || hasUserSite) {
        currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId}`;
      } else {
        currentSiteInfo.siteDocumentsRootName = `Site Folder: ${workspaceSites[0].siteId}`;
      }
    }
  } else if (!hasUserSite && pathname.indexOf('/team-documents') === 0) {
    if (hasDefaultSite || !hasWorkspaces || !workspaceSites.length) {
      currentSiteInfo.siteId = 'default';
      currentSiteInfo.siteRedirectUrl = '/documents';
      currentSiteInfo.siteDocumentsRootUri = '/documents';
      currentSiteInfo.siteDocumentsRootName = 'Documents';
    } else if (hasWorkspaces) {
      currentSiteInfo.siteId = workspaceSites[0].siteId;
      currentSiteInfo.siteRedirectUrl = `/workspaces/${workspaceSites[0].siteId}`;
      currentSiteInfo.siteDocumentsRootUri = `/workspaces/${workspaceSites[0].siteId}`;
      currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
        '_',
        ' '
      )}`;
    }
  }
  if (user && user.email) {
    if (pathname.indexOf('/my-documents') === 0) {
      currentSiteInfo.siteId = user.email;
      currentSiteInfo.siteDocumentsRootUri = '/my-documents';
      currentSiteInfo.siteDocumentsRootName = 'My Documents';
    } else if (pathname.indexOf('/team-documents') === 0) {
      currentSiteInfo.siteId = 'default';
      currentSiteInfo.siteDocumentsRootUri = '/team-documents';
      currentSiteInfo.siteDocumentsRootName = 'Team Documents';
    } else if (pathname.indexOf('/workspaces') === 0) {
      const pathAfterWorkspaces = pathname.substring(
        pathname.indexOf('/', 1) + 1
      );
      if (pathAfterWorkspaces.indexOf('/') > -1) {
        currentSiteInfo.siteId = pathAfterWorkspaces.substring(
          0,
          pathAfterWorkspaces.indexOf('/')
        );
      } else {
        currentSiteInfo.siteId = pathAfterWorkspaces;
      }
      if (!currentSiteInfo.siteId.length) {
        if (hasUserSite) {
          currentSiteInfo.siteId = user.email;
          currentSiteInfo.siteRedirectUrl = '/my-documents';
          currentSiteInfo.siteDocumentsRootUri = '/my-documents';
          currentSiteInfo.siteDocumentsRootName = 'My Documents';
        } else if (hasDefaultSite) {
          currentSiteInfo.siteId = user.email;
          currentSiteInfo.siteRedirectUrl = '/my-documents';
          currentSiteInfo.siteDocumentsRootUri = '/my-documents';
          currentSiteInfo.siteDocumentsRootName = 'My Documents';
        } else {
          currentSiteInfo.siteId = '';
          currentSiteInfo.siteRedirectUrl = '/documents';
          currentSiteInfo.siteDocumentsRootUri = '/documents';
          currentSiteInfo.siteDocumentsRootName = 'Documents';
        }
      }
      currentSiteInfo.siteDocumentsRootUri = `/workspaces/${currentSiteInfo.siteId}`;
      currentSiteInfo.siteDocumentsRootName = `Workspace: ${(
        currentSiteInfo.siteId as any
      ).replaceAll('_', ' ')}`;
    } else if (pathname.indexOf('/rulesets') === 0) {
      if (pathname.indexOf('/rulesets/workspaces') === 0) {
        currentSiteInfo.siteId = pathname.substring(21).split('/')[0]; // 21 is the length of '/rulesets/workspaces/'
        currentSiteInfo.siteDocumentsRootName = `Workspace: ${(
          currentSiteInfo.siteId as any
        ).replaceAll('_', ' ')}`;
      } else {
        if (hasDefaultSite) {
          currentSiteInfo.siteId = 'default';
          currentSiteInfo.siteDocumentsRootName = 'Rulesets';
        } else if (hasUserSite) {
          currentSiteInfo.siteId = user.email;
          currentSiteInfo.siteRedirectUrl = '/my-rulesets';
          currentSiteInfo.siteDocumentsRootName = 'My Rulesets';
        } else if (hasWorkspaces) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteRedirectUrl = `/rulesets/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
      }
    } else if (pathname.indexOf('/schemas') === 0) {
      if (pathname.indexOf('/schemas/workspaces') === 0) {
        currentSiteInfo.siteId = pathname.substring(20).split('/')[0]; // 20 is the length of '/schemas/workspaces/'
        currentSiteInfo.siteDocumentsRootName = `Workspace: ${(
          currentSiteInfo.siteId as any
        ).replaceAll('_', ' ')}`;
      } else {
        if (hasDefaultSite) {
          currentSiteInfo.siteId = 'default';
          currentSiteInfo.siteDocumentsRootName = 'Schemas';
        } else if (hasWorkspaces) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteRedirectUrl = `/schemas/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
      }
    } else if (pathname.indexOf('/workflows') === 0) {
      if (pathname.indexOf('/workflows/workspaces') === 0) {
        currentSiteInfo.siteId = pathname.substring(22).split('/')[0]; // 22 is the length of '/workflows/workspaces/'
        currentSiteInfo.siteDocumentsRootName = `Workspace: ${(
          currentSiteInfo.siteId as any
        ).replaceAll('_', ' ')}`;
      } else {
        if (hasDefaultSite) {
          currentSiteInfo.siteId = 'default';
          currentSiteInfo.siteDocumentsRootName = 'Workflows';
        } else if (hasWorkspaces) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteRedirectUrl = `/workflows/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
      }
    } else if (pathname.indexOf('/queues') === 0) {
      if (pathname.indexOf('/queues/workspaces') === 0) {
        currentSiteInfo.siteId = pathname.substring(19).split('/')[0]; // 19 is the length of '/queues/workspaces'
        currentSiteInfo.siteDocumentsRootName = `Queue: ${(
          currentSiteInfo.siteId as any
        ).replaceAll('_', ' ')}`;
      } else {
        if (hasDefaultSite) {
          currentSiteInfo.siteId = 'default';
          currentSiteInfo.siteDocumentsRootName = 'Queues';
        } else if (hasWorkspaces) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteRedirectUrl = `/queues/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
      }
    } else if (pathname.indexOf('/admin/api-keys') === 0) {
      if (pathname.indexOf('/admin/api-keys/workspaces') === 0) {
        currentSiteInfo.siteId = pathname.substring(27).split('/')[0]; // 27 is the length of '/admin/api-keys/workspaces'
        currentSiteInfo.siteDocumentsRootName = `API Keys: ${(
          currentSiteInfo.siteId as any
        ).replaceAll('_', ' ')}`;
      } else {
        if (hasDefaultSite) {
          currentSiteInfo.siteId = 'default';
          currentSiteInfo.siteDocumentsRootName = 'API Keys';
        } else if (hasWorkspaces) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteRedirectUrl = `/admin/api-keys/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
      }
    } else if (pathname.indexOf('/admin/user-activities') === 0) {
      if (pathname.indexOf('/admin/user-activities/workspaces') === 0) {
        currentSiteInfo.siteId = pathname.substring(34).split('/')[0]; // 34 is the length of '/admin/user-activities/workspaces'
        currentSiteInfo.siteDocumentsRootUri = `/workspaces/${currentSiteInfo.siteId}`;
        currentSiteInfo.siteDocumentsRootName = `User Activities: ${(
          currentSiteInfo.siteId as any
        ).replaceAll('_', ' ')}`;
      } else {
        if (hasDefaultSite) {
          currentSiteInfo.siteId = 'default';
          currentSiteInfo.siteDocumentsRootName = 'User Activities';
          currentSiteInfo.siteDocumentsRootUri = '/documents';
        } else if (hasWorkspaces) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteDocumentsRootUri = `/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteRedirectUrl = `/admin/user-activities/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${workspaceSites[0].siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
      }
    } else {
      if (hasDefaultSite) {
        currentSiteInfo.siteId = 'default';
        currentSiteInfo.siteDocumentsRootUri = '/documents';
        currentSiteInfo.siteDocumentsRootName = 'Documents';
      } else if (hasUserSite) {
        currentSiteInfo.siteId = user.email;
        currentSiteInfo.siteRedirectUrl = '/my-documents';
        currentSiteInfo.siteDocumentsRootUri = '/my-documents';
        currentSiteInfo.siteDocumentsRootName = 'My Documents';
      } else {
        if (
          !currentSiteInfo ||
          !currentSiteInfo.siteId ||
          !currentSiteInfo.siteId.length
        ) {
          currentSiteInfo.siteId = workspaceSites[0].siteId;
          currentSiteInfo.siteRedirectUrl = `/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootUri = `/workspaces/${workspaceSites[0].siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Site Folder: ${workspaceSites[0].siteId}`;
        }
      }
    }
    if (currentSiteInfo.siteId === '' && user) {
      user.sites.forEach((site: any) => {
        currentSiteInfo.siteId = site.siteId;
        if (site.siteId !== 'default' && site.siteId !== user.email) {
          currentSiteInfo.siteDocumentsRootUri = `/workspaces/${site.siteId}`;
          currentSiteInfo.siteDocumentsRootName = `Workspace: ${site.siteId.replaceAll(
            '_',
            ' '
          )}`;
        }
        return;
      });
    }
    user.sites.forEach((site: any) => {
      if (site.siteId === currentSiteInfo.siteId) {
        if (site.permission && site.permission === 'READ_ONLY') {
          currentSiteInfo.isSiteReadOnly = true;
        } else {
          currentSiteInfo.isSiteReadOnly = false;
        }
        return;
      }
    });
  }
  return currentSiteInfo;
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
        const subfolderResult = findFolderAndParent(
          folderId,
          parentFolder.folders[i]
        );
        // NOTE: if `number` on subfolders is not null, a match has been found that we can return
        if (subfolderResult[1] !== null) {
          return subfolderResult;
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
          return !isTagValueIncludes(doc.tags[tagKey], tagValue);
        });
      } else {
        return (docs as any[]).filter((doc: any) => {
          if (isSystemDeletedByKey) {
            return (doc.tags as any)['sysDeletedBy'];
          } else {
            return !(doc.tags as any)['sysDeletedBy'];
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

export function parseEmailInitials(email: string) {
  if (!email?.length) {
    return '';
  }
  const emailUsername = email.substring(0, email.indexOf('@'));
  const emailParts = emailUsername.split('.');
  let initials = '';
  emailParts.forEach((part: string) => {
    initials += part[0];
  });
  initials = initials.substring(0, 3).toUpperCase();
  return initials;
}
