import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Mode } from 'vanilla-jsoneditor';
import { JSONEditorReact } from '../../Components/TextEditors/JsonEditor';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  RulesetsState,
  fetchRule,
  fetchRules,
} from '../../Store/reducers/rulesets';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import ButtonPrimary from "../../Components/Generic/Buttons/ButtonPrimary";

function Rule() {
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
  const { id, ruleId } = useParams();
  const [rulesetId, setRulesetId] = useState(id || '');
  const [currentRuleId, setCurrentRuleId] = useState(ruleId || '');

  const { rule } = useSelector(RulesetsState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRule({ ruleId, rulesetId: id, siteId: currentSiteId }));
  }, []);

  useEffect(() => {
    if (id) {
      setRulesetId(id);
    }
    if (ruleId) {
      setCurrentRuleId(ruleId);
    }
  }, [id, currentRuleId]);

  // JSON editor
  const [content, setContent] = useState({
    text: undefined,
    json: rule,
  });

  useEffect(() => {
    setContent({
      text: undefined,
      json: rule,
    });
  }, [rule]);

  const isValidString = (text: string) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const isValidJSON = (json: any) => {
    try {
      JSON.stringify(json);
    } catch (e) {
      return false;
    }
    return true;
  };

  const onRuleSave = (ruleId: string) => {
    function onResponse(res: any) {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Rule saved successfully',
          })
        );
        dispatch(fetchRules({ siteId: currentSiteId, rulesetId }));
      } else if (res.errors && res.errors.length > 0) {
        dispatch(
          openNotificationDialog({
            dialogTitle:
              'Error happened in ' +
              res.errors[0].key +
              ': ' +
              res.errors[0].error,
          })
        );
      } else {
        dispatch(
          openNotificationDialog({
            dialogTitle:
              'Error happened while saving rule. Please try again later',
          })
        );
      }
    }

    if (content.json && isValidJSON(content.json)) {
      DocumentsService.updateRule(
        rulesetId,
        ruleId,
        { rule: content.json },
        currentSiteId
      ).then((res) => {
        onResponse(res);
      });
    } else if (content.text && isValidString(content.text)) {
      DocumentsService.updateRule(
        rulesetId,
        ruleId,
        { rule: JSON.parse(content.text) },
        currentSiteId
      ).then((res) => {
        onResponse(res);
      });
    } else {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please enter valid Open Policy value',
        })
      );
    }
  };
  const handleChange = (value: any) => {
    if (value.json) {
      setContent(value);
    } else if (value.text) {
      setContent(value);
    }
  };

  return (
    <>
      <Helmet>
        <title>Rule</title>
      </Helmet>
      <div
        className="flex flex-col "
        style={{
          height: `calc(100vh - 3.68rem)`,
        }}
      >
        <div className="w-full p-2 flex justify-end gap-2">
          <ButtonPrimary
            onClick={() => onRuleSave(currentRuleId)}
          >
            Save
          </ButtonPrimary>

          <a
            href={pathname.split('/').slice(0, -2).join('/')}
            className="border border-neutral-900 hover:text-primary-500 font-bold py-2 px-4 rounded-md"
          >
            Return to Ruleset
          </a>
        </div>
        <div className=" inline-block h-full">
          <JSONEditorReact
            content={content}
            mode={Mode.text}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}

export default Rule;
