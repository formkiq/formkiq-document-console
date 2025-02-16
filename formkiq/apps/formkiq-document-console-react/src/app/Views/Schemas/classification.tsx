import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Mode } from 'vanilla-jsoneditor';

import { Close, Save, Spinner, Trash } from '../../Components/Icons/icons';
import SchemaMenu from '../../Components/Schemas/SchemaMenu';
import SchemaPage from '../../Components/Schemas/SchemaPage';
import { JSONEditorReact } from '../../Components/TextEditors/JsonEditor';
import { CopyButton } from '../../Components/Generic/Buttons/CopyButton';

import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import {
  SchemasState,
  fetchClassificationSchema,
  setClassificationSchema,
} from '../../Store/reducers/schemas';
import { useAppDispatch } from '../../Store/store';

import { DocumentsService } from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { Schema as SchemaType } from '../../helpers/types/schemas';
import { useJsonEditor } from '../../hooks/json-editor.hook';
import {
  isValidJSON,
  isValidString,
} from '../../helpers/utils/json-editor-validators';

function Classification() {
  const pathname = decodeURI(useLocation().pathname);

  const { classificationId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const { classificationSchema } = useSelector(SchemasState);
  const dispatch = useAppDispatch();

  const {
    setContent,
    content,
    handleChange,
    editor,
    closeEditor,
    isEditing,
    schemaMenuEditClick,
  } = useJsonEditor({ schema: classificationSchema });

  useEffect(() => {
    if (!classificationId) {
      return;
    }
    dispatch(fetchClassificationSchema({ siteId, classificationId }));
  }, []);

  useEffect(() => {
    setContent({
      text: undefined,
      json: classificationSchema,
    });
  }, [classificationSchema]);

  const updateClassification = (schema: SchemaType) => {
    if (!classificationId) return;
    DocumentsService.setClassification(siteId, classificationId, {
      classification: schema,
    }).then((res) => {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Schema saved successfully',
          })
        );
        dispatch(setClassificationSchema(schema));
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
      updateClassification(content.json);
    } else if (content.text && isValidString(content.text)) {
      updateClassification(JSON.parse(content.text));
    } else {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please enter valid schema value',
        })
      );
    }
  };

  const onDeleteClick = () => {
    if (!classificationId) {
      return;
    }
    const deleteSchema = () => {
      DocumentsService.deleteClassification(siteId, classificationId).then(
        (res) => {
          if (res.status === 200) {
            navigate('/schemas');
          } else {
            dispatch(
              openNotificationDialog({
                dialogTitle: 'Schema delete failed. Please try again later.',
              })
            );
          }
        }
      );
    };
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this Schema?',
        callback: deleteSchema,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Schema</title>
      </Helmet>

      {classificationSchema ? (
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
                  Return to Schemas / Classifications
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
                <button
                  className="h-6 text-neutral-900 hover:text-primary-500"
                  title="Delete Schema"
                  type="button"
                  onClick={onDeleteClick}
                >
                  <Trash />
                </button>
              </div>
            </div>
            <h2 className="text-xl font-bold px-4 mt-4">
              {classificationSchema.name}
            </h2>
            {classificationId && (
              <span className="block text-xs font-semibold px-4 mb-2">
                ID:{' '}
                <span className=" text-neutral-500">{classificationId}</span>
                <span className="pl-2">
                  <CopyButton value={classificationId} />
                </span>
              </span>
            )}

            <div className=" inline-block h-full">
              <JSONEditorReact
                content={content}
                mode={Mode.text}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="p-4 ">
            <SchemaMenu
              deleteSchema={onDeleteClick}
              onEditClick={schemaMenuEditClick}
              isEditing={isEditing}
            />
            <SchemaPage
              isEditing={isEditing}
              siteId={siteId}
              schemaType="classification"
              initialSchemaValue={classificationSchema}
              classificationId={classificationId}
            />
          </div>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default Classification;
