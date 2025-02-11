import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from 'vanilla-jsoneditor';
import { Close, Save, Spinner } from '../../Components/Icons/icons';
import SchemaMenu from '../../Components/Schemas/SchemaMenu';
import { JSONEditorReact } from '../../Components/TextEditors/JsonEditor';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  SchemasState,
  fetchSiteSchema,
  setSiteSchema,
} from '../../Store/reducers/schemas';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { Schema as SchemaType } from '../../helpers/types/schemas';
import SchemaPage from '../../Components/Schemas/SchemaPage';

function SiteSchema() {
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

  const [searchParams, setSearchParams] = useSearchParams();
  const editor = searchParams.get('jsonEditor');
  const editing = searchParams.get('editing');
  const { siteSchema } = useSelector(SchemasState);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(editing === 'true');

  useEffect(() => {
    if (!siteId) {
      return;
    }
    dispatch(fetchSiteSchema({ siteId }));
  }, []);

  // JSON editor
  const [content, setContent] = useState({
    text: undefined,
    json: siteSchema,
  });

  useEffect(() => {
    setContent({
      text: undefined,
      json: siteSchema,
    });
  }, [siteSchema]);

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

  const updateSiteSchema = (schema: SchemaType) => {
    if (!siteId) return;
    DocumentsService.setSiteSchema(siteId, schema).then((res) => {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Schema saved successfully',
          })
        );
        dispatch(setSiteSchema(schema));
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
              'Error happened while saving schema. Please try again later',
          })
        );
      }
    });
  };

  const saveSchemaInEditor = () => {
    if (content.json && isValidJSON(content.json)) {
      updateSiteSchema(content.json);
    } else if (content.text && isValidString(content.text)) {
      updateSiteSchema(JSON.parse(content.text));
    } else {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please enter valid schema value',
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
  const closeEditor = () => {
    searchParams.delete('jsonEditor');
    searchParams.delete('editing');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setIsEditing(editing === 'true')
  }, [editing])

  return (
    <>
      <Helmet>
        <title>Schema</title>
      </Helmet>

      {siteSchema ? (
        editor ? (
          <div
            className="flex flex-col "
            style={{
              height: `calc(100vh - 3.68rem)`,
            }}
          >
            <div className="w-full py-2 flex justify-between gap-2 mt-2 px-4">
              <div className="flex gap-2 items-end">
                <button
                  onClick={closeEditor}
                  className="h-8 text-neutral-900 bg-neutral-200 hover:bg-neutral-300 rounded-md p-2 flex items-center gap-2 mr-2 whitespace-nowrap font-bold text-sm"
                  title="Close JSON Editor"
                >
                  Close JSON Editor
                  <div className="w-4 h-4">
                    <Close />
                  </div>
                </button>
                <NavLink
                  to={pathname.substring(0, pathname.lastIndexOf('/'))}
                  className="h-6 text-neutral-900 hover:text-primary-500 "
                >
                  Return to Schemas
                </NavLink>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveSchemaInEditor}
                  className="h-7 w-7 text-neutral-900 hover:text-primary-500"
                  title="Save"
                >
                  <Save />
                </button>
              </div>
            </div>

            <div className=" inline-block h-full">
              <JSONEditorReact
                content={content}
                mode={Mode.text}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <SchemaMenu
              onEditClick={() => {
                searchParams.set('editing', 'true');
                setSearchParams(searchParams);
              }}
              isEditing={isEditing}
            />
            <SchemaPage
              isEditing={isEditing}
              siteId={siteId}
              schemaType="site"
              initialSchemaValue={siteSchema}
            />
          </div>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default SiteSchema;
