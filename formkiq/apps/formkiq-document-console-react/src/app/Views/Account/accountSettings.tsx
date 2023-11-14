import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import {
  closeDialog,
  openDialog,
} from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';

export function AccountSettings() {
  const { user } = useAuthenticatedState();
  const sites = useMemo(() => {
    let userSite = null;
    let defaultSite = null;
    const sites: any[] = [];
    const workspaceSites: any[] = [];
    if (user && user.sites) {
      user.sites.forEach((site: any) => {
        if (site.siteId === user.email) {
          userSite = site;
        } else if (site.siteId === 'default') {
          defaultSite = site;
        } else {
          workspaceSites.push(site);
        }
      });
    }
    if (defaultSite) {
      sites.push(defaultSite);
    }
    if (userSite) {
      sites.push(userSite);
    }
    return sites.concat(workspaceSites);
  }, [user]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  const dispatch = useAppDispatch();
  const [currentSiteId, setCurrentSiteId] = useState(sites[0].siteId);
  const [currentConfiguration, setCurrentConfiguration] = useState(null);

  useEffect(() => {
    DocumentsService.getConfiguration(currentSiteId).then((response: any) => {
      if (response) {
        setCurrentConfiguration(response);
        setValue('maxDocuments', response.maxDocuments);
        setValue('maxContentLengthBytes', response.maxContentLengthBytes);
        setValue('maxWebhooks', response.maxWebhooks);
        setValue('chatGptApiKey', response.chatGptApiKey);
      }
    });
  }, [currentSiteId]);

  const updateCurrentSite = (val: any) => {
    setCurrentSiteId(val);
  };

  const onSubmit = (data: any) => {
    const configuration: any = {};
    if (
      data.maxDocuments.length &&
      !isNaN(data.maxDocuments) &&
      data.maxDocuments >= -1
    ) {
      configuration.maxDocuments = data.maxDocuments;
    }
    if (
      data.maxContentLengthBytes.length &&
      !isNaN(data.maxContentLengthBytes) &&
      data.maxContentLengthBytes >= -1
    ) {
      configuration.maxContentLengthBytes = data.maxContentLengthBytes;
    }
    if (
      data.maxWebhooks.length &&
      !isNaN(data.maxWebhooks) &&
      data.maxWebhooks >= -1
    ) {
      configuration.maxWebhooks = data.maxWebhooks;
    }
    if (data.chatGptApiKey.length) {
      configuration.chatGptApiKey = data.chatGptApiKey;
    }
    DocumentsService.updateConfiguration(configuration, currentSiteId).then(
      (response) => {
        if (response.status === 200) {
          dispatch(
            openDialog({
              dialogTitle:
                'Site Configuration for site "' +
                currentSiteId +
                '" has been updated.',
            })
          );
          closeDialog();
        } else {
          dispatch(
            openDialog({
              dialogTitle:
                'Site Configuration for site "' +
                currentSiteId +
                '" did not update correctly. Please contact your document management system administrator for more info.',
            })
          );
        }
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <form
        className="border bg-gray-100 my-2 mr-4 mx-2 p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h6 className="w-full ml-4 my-2 text-base tracking-tight leading-10 font-bold text-gray-900 sm:leading-none">
            Site Configuration
          </h6>
        </div>
        <div className="md:flex md:items-center ml-2 mr-2 mb-4 relative">
          <div className="w-full md:w-1/4">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Site ID
            </label>
          </div>
          <div className="w-full md:w-1/4">
            <select
              aria-label="Site ID"
              name="siteID"
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
              onChange={(event) => {
                updateCurrentSite(event.target.value);
              }}
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
        <div className="md:flex md:items-center mx-4 mb-4 relative">
          <div className="w-full md:w-1/4">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Maximum Number of Documents:
            </label>
          </div>
          <div className="w-full md:w-1/4">
            <input
              aria-label="Maximum Number of Documents"
              type="text"
              {...register('maxDocuments')}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mx-4 mb-4 relative">
          <div className="w-full md:w-1/4">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Total Storage Size (in bytes):
            </label>
          </div>
          <div className="w-full md:w-1/4">
            <input
              aria-label="Total Storage Size (in bytes)"
              type="text"
              {...register('maxContentLengthBytes')}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mx-4 mb-4 relative">
          <div className="w-full md:w-1/4">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Maximum Number of Webhooks:
            </label>
          </div>
          <div className="w-full md:w-1/4">
            <input
              aria-label="Maximum Number of Webhooks"
              type="text"
              {...register('maxWebhooks')}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
            />
          </div>
        </div>
        <div className="md:flex md:items-center mx-4 mb-4 relative">
          <div className="w-full md:w-1/4">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              OpenAI API Key:
            </label>
          </div>
          <div className="w-full md:w-3/4">
            <input
              aria-label="OpenAI API Key"
              type="text"
              {...register('chatGptApiKey')}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600
                  placeholder-gray-500 text-gray-900 rounded-t-md
                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10"
            />
          </div>
        </div>
        <div className="flex w-full justify-center ml-2">
          <input
            type="submit"
            value={'Update Configuration for Site "' + currentSiteId + '"'}
            className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
          />
        </div>
      </form>
    </>
  );
}

export default AccountSettings;
