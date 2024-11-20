import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import { Json } from '../../Components/Icons/icons';
import CreateSchemaDialog from '../../Components/Schemas/createSchemaDialog/CreateSchemaDialog';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import {
  SchemasState,
  deleteClassification,
  fetchClassifications,
  fetchSiteSchema,
  setClassificationsLoadingStatusPending,
} from '../../Store/reducers/schemas';
import { useAppDispatch } from '../../Store/store';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import ClassificationsTable from './classificationsTable';

function Schemas() {
  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const {
    siteSchema,
    classifications,
    nextToken,
    loadingStatus,
    isLastSearchPageLoaded,
    currentSearchPage,
  } = useSelector(SchemasState);
  const dispatch = useAppDispatch();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSchemaType, setNewSchemaType] = useState<'site' | 'classification'>(
    'site'
  );

  // update siteId
  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    setCurrentSiteId(recheckSiteInfo.siteId);
  }, [pathname]);

  // update schemas when different siteId selected
  useEffect(() => {
    dispatch(fetchClassifications({ siteId: currentSiteId, page: 1 }));
    dispatch(fetchSiteSchema({ siteId: currentSiteId }));
  }, [currentSiteId]);

  // load more schemas when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('classificationsScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextToken &&
      loadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setClassificationsLoadingStatusPending());
      if (nextToken) {
        await dispatch(
          fetchClassifications({
            siteId: currentSiteId,
            nextToken,
            page: currentSearchPage + 1,
          })
        );
      }
    }
  }, [nextToken, loadingStatus, isLastSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  // Delete schema
  const onClassificationDelete = (classificationId: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this schema?',
        callback: () => {
          dispatch(
            deleteClassification({
              classificationId,
              siteId: currentSiteId,
            })
          );
        },
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Schemas</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <h3 className="text-lg p-4 font-bold">Site Schema: {siteId}</h3>

        <table className="w-full border-collapse text-sm table-fixed ">
          <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
            <tr>
              <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Name
              </th>
              <th className=" w-full border-b border-t p-4 pr-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white ">
            {siteSchema ? (
              <>
                <tr className="text-neutral-900 border-neutral-300">
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate">
                    <Link
                      to={`${pathname}/site-schema`}
                      className="cursor-pointer hover:text-primary-500"
                    >
                      {siteSchema.name}
                    </Link>
                  </td>

                  <td className="border-b border-neutral-300 p-4 pr-8">
                    <div className="flex items-center justify-end gap-2 mr-3">
                      <NavLink
                        title="Open in editor"
                        to={`${pathname}/site-schema?editor=true`}
                        className="h-6"
                      >
                        <button
                          className="w-6 h-auto"
                          title="Open in JSON Editor"
                        >
                          <Json />
                        </button>
                      </NavLink>
                    </div>
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={2} className="text-center p-2">
                  No site schema has been added yet.{' '}
                  <button
                    className="underline text-primary-500 hover:text-primary-600"
                    onClick={() => {
                      setIsCreateDialogOpen(true);
                      setNewSchemaType('site');
                    }}
                  >
                    Add new site schema.
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="w-full h-px bg-gray-300 mt-4"></div>
        <div className="w-full flex justify-between items-center px-4 mt-2">
          <h3 className="text-lg font-bold">
            Classification Schemas (site: {siteId})
          </h3>
          <ButtonPrimaryGradient
            onClick={() => {
              setIsCreateDialogOpen(true);
              setNewSchemaType('classification');
            }}
            className="h-10"
          >
            + New Classification Schema
          </ButtonPrimaryGradient>
        </div>
        {/*<div className="text-base p-4 font-semibold">*/}
        {/*  NOTE: Schemas are currently not editable; if a schema is not yet in*/}
        {/*  use, you can delete the new schema and re-create with your changes.*/}
        {/*  Once in use, schemas can not be changed.*/}
        {/*  <span className="block font-normal">*/}
        {/*    (at least, not with the current version of FormKiQ)*/}
        {/*  </span>*/}
        {/*</div>*/}
        <div
          className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full mt-2"
          id="classificationsScrollPane"
          onScroll={handleScroll}
        >
          <ClassificationsTable
            classifications={classifications}
            onClassificationDelete={onClassificationDelete}
          />
        </div>
      </div>
      <CreateSchemaDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        siteId={currentSiteId}
        schemaType={newSchemaType}
      />
    </>
  );
}

export default Schemas;
