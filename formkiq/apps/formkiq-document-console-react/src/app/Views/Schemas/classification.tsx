import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {Mode} from 'vanilla-jsoneditor';
import {Close, Save, Spinner, Trash} from '../../Components/Icons/icons';
import SchemaMenu from '../../Components/Schemas/SchemaMenu';
import CompositeKeysTable from '../../Components/Schemas/tables/compositeKeysTable';
import RequiredAttributesTable from '../../Components/Schemas/tables/requiredAttributesTable';
import {JSONEditorReact} from '../../Components/TextEditors/JsonEditor';
import {useAuthenticatedState} from '../../Store/reducers/auth';
import {openDialog as openConfirmationDialog} from '../../Store/reducers/globalConfirmControls';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import {setClassificationSchema, SchemasState, fetchClassificationSchema} from '../../Store/reducers/schemas';
import {useAppDispatch} from '../../Store/store';
import {DocumentsService} from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import {Schema as SchemaType} from '../../helpers/types/schemas';
import OptionalAttributesTable from "../../Components/Schemas/tables/optionalAttributesTable";
import EditSchemaDialog from "../../Components/Schemas/createSchemaDialog/EditSchemaDialog";

function Classification() {
  const {user} = useAuthenticatedState();
  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {siteId} = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const {classificationId} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const editor = searchParams.get('editor');

  const {classificationSchema} = useSelector(SchemasState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!classificationId) {
      return;
    }
    dispatch(fetchClassificationSchema({siteId, classificationId}));
  }, []);

  // JSON editor
  const [content, setContent] = useState({
    text: undefined,
    json: classificationSchema,
  });

  useEffect(() => {
    setContent({
      text: undefined,
      json: classificationSchema,
    });
  }, [classificationSchema]);

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

  const updateClassification = (schema: SchemaType) => {
    if (!classificationId) return;
    DocumentsService.setClassification(siteId, classificationId, {classification: schema},).then(res => {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Schema saved successfully',
          })
        );
        dispatch(setClassificationSchema(schema))
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
    })
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

  const handleChange = (value: any) => {
    if (value.json) {
      setContent(value);
    } else if (value.text) {
      setContent(value);
    }
  };
  const closeEditor = () => {
    searchParams.delete('editor');
    setSearchParams(searchParams);
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
                  title="Close Editor"
                >
                  Close Editor
                  <div className="w-4 h-4">
                    <Close/>
                  </div>
                </button>
                <NavLink
                  to={'/schemas'}
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
                  <Save/>
                </button>
                <button
                  className="h-6 text-neutral-900 hover:text-primary-500"
                  title="Delete Schema"
                  type="button"
                  onClick={onDeleteClick}
                >
                  <Trash/>
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
              schema={classificationSchema}
              updateSchema={updateClassification}
              deleteSchema={onDeleteClick}
              openEditDialog={() => setIsEditDialogOpen(true)}
            />
            <p className="text-neutral-900 text-md font-bold my-4">
              Composite Keys
            </p>
            <CompositeKeysTable compositeKeys={classificationSchema.attributes.compositeKeys}/>

            <p className="text-neutral-900 text-md font-bold my-4">
              Required Attributes
            </p>
            <RequiredAttributesTable attributes={classificationSchema.attributes.required}/>

            <p className="text-neutral-900 text-md font-bold my-4">
              Optional Attributes
            </p>
            <OptionalAttributesTable attributes={classificationSchema.attributes.optional}/>
          </div>
        )
      ) : (
        <Spinner/>
      )}
      {classificationSchema && <EditSchemaDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        siteId={siteId}
        schemaType='classification'
        initialSchemaValue={classificationSchema}
        classificationId={classificationId}
      />}
    </>
  );
}

export default Classification;
