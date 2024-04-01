import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CreateTagSchemaDialog from '../../Components/TagSchemas/createTagSchemaDialog/CreateTagSchemaDialog';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  TagSchemasState,
  deleteTagSchema,
  fetchTagSchemas,
  setTagSchemasLoadingStatusPending,
} from '../../Store/reducers/tagSchemas';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { RequestStatus } from '../../helpers/types/document';
import { TagSchema } from '../../helpers/types/tagSchemas';
import TagSchemasTable from './tagSchemasTable';
// import ButtonPrimaryGradient from "../../Components/Generic/Buttons/ButtonPrimaryGradient";
// import ButtonPrimary from "../../Components/Generic/Buttons/ButtonPrimary";
// import ButtonGhost from "../../Components/Generic/Buttons/ButtonGhost";

function TagSchemas() {
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
    tagSchemas,
    nextToken,
    loadingStatus,
    isLastSearchPageLoaded,
    currentSearchPage,
  } = useSelector(TagSchemasState);
  const dispatch = useAppDispatch();
  const [isRulesetEditTabVisible, setIsRulesetEditTabVisible] = useState(false);

  const [newTagSchemaValue, setNewTagSchemaValue] = useState<{
    tagSchema: TagSchema;
  } | null>(null);

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

  // update rulesets when different siteId selected
  useEffect(() => {
    dispatch(fetchTagSchemas({ siteId: currentSiteId }));
  }, [currentSiteId]);

  // load more rulesets when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('rulesetsScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextToken &&
      loadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setTagSchemasLoadingStatusPending());
      if (nextToken) {
        await dispatch(
          fetchTagSchemas({
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

  // Delete ruleset
  const onTagSchemaDelete = (tagSchemaId: string) => {
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this TagSchema?',
        callback: () => {
          dispatch(
            deleteTagSchema({
              tagSchemaId,
              siteId: currentSiteId,
              tagSchemas: tagSchemas,
            })
          );
        },
      })
    );
  };

  // Save new or existing ruleset
  const saveTagSchema = () => {
    if (newTagSchemaValue?.tagSchema?.tagSchemaId) {
      // Check if editing existing ruleset
      // DocumentsService.updateTagSchema(
      //   newTagSchemaValue.tagSchema.tagSchemaId,
      //   newTagSchemaValue,
      //   currentSiteId
      // ).then((res) => {
      //   if (res.status === 200) {
      //     dispatch(fetchRulesets({ siteId: currentSiteId }));
      //     setIsRulesetEditTabVisible(false);
      //     setNewTagSchemaValue(null);
      //   } else {
      //     dispatch(
      //       openNotificationDialog({
      //         dialogTitle:
      //           'Error happened while saving ruleset. Please try again later',
      //       })
      //     );
      //   }
      // });
    } else {
      DocumentsService.addTagSchema(newTagSchemaValue, currentSiteId).then(
        (res) => {
          if (res.status === 200) {
            dispatch(fetchTagSchemas({ siteId: currentSiteId }));
            setIsRulesetEditTabVisible(false);
            setNewTagSchemaValue(null);
          } else {
            dispatch(
              openNotificationDialog({
                dialogTitle:
                  'Error happened while saving ruleset. Please try again later',
              })
            );
          }
        }
      );
    }
  };

  // Open tab to create/edit ruleset
  const showRulesetEditTab = (rulesetId: string) => {
    const tagSchema = tagSchemas.find(
      (tagSchema) => tagSchema.tagSchemaId === rulesetId
    );
    if (!tagSchema) {
      return;
    }
    setNewTagSchemaValue({ tagSchema });
    setIsRulesetEditTabVisible(true);
  };

  function onCancelEdit() {
    setIsRulesetEditTabVisible(false);
    setNewTagSchemaValue(null);
  }
  const tempTagSchema = {
    name: 'string updated',
    tags: {
      compositeKeys: [
        {
          key: ['string'],
        },
      ],
      required: [
        {
          key: 'string',
          defaultValues: ['string'],
          allowedValues: ['string'],
        },
      ],
      optional: [
        {
          key: 'string',
          defaultValues: ['string'],
          allowedValues: ['string'],
        },
      ],
      allowAdditionalTags: true,
    },
  };

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
        <div className="w-full p-2 flex justify-start">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="h-10 bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 rounded-md font-bold"
          >
            + NEW
          </button>
        </div>
        <div className="text-base p-4 font-semibold">
          NOTE: Schemas are currently not editable; if a schema is not yet in
          use, you can delete the new schema and re-create with your changes.
          Once in use, schemas can not be changed.
          <span className="block font-normal">
            (at least, not with the current version of FormKiQ)
          </span>
        </div>
        <div
          className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full"
          id="rulesetsScrollPane"
          onScroll={handleScroll}
        >
          <TagSchemasTable
            tagSchemas={tagSchemas}
            onTagSchemaDelete={onTagSchemaDelete}
            showRulesetEditTab={showRulesetEditTab}
          />
        </div>
      </div>
      <CreateTagSchemaDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        siteId={currentSiteId}
      />
    </>
  );
}

export default TagSchemas;
