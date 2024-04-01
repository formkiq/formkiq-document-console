import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useSelector} from 'react-redux';
import {NavLink, useLocation, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {Mode} from 'vanilla-jsoneditor';
import {JSONEditorReact} from '../../Components/TextEditors/JsonEditor';
import {useAuthenticatedState} from '../../Store/reducers/auth';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import {openDialog as openConfirmationDialog} from '../../Store/reducers/globalConfirmControls';
import {useAppDispatch} from '../../Store/store';
import {DocumentsService} from '../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import {setTagSchema, TagSchemasState} from "../../Store/reducers/tagSchemas";
import {Close, Spinner, Trash} from "../../Components/Icons/icons";
import {TagSchema as TagSchemaType} from "../../helpers/types/tagSchemas";
import TagSchemaMenu from "../../Components/TagSchemas/TagSchemaMenu";
import CompositeKeysTable from "../../Components/TagSchemas/tables/compositeKeysTable";
import TagsTable from "../../Components/TagSchemas/tables/tagsTable";

function TagSchema() {
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
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const {tagSchemaId} = useParams();
  const [searchParams, setSearchParams] = useSearchParams()
  const editor = searchParams.get('editor')

  const {tagSchema} = useSelector(TagSchemasState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (!tagSchemaId) {
      return;
    }
    DocumentsService.getTagSchema(tagSchemaId, currentSiteId).then(
      (res) => {
        dispatch(setTagSchema(res))
      })
  }, []);

  // JSON editor
  const [content, setContent] = useState({
    text: undefined,
    json: tagSchema,
  });

  useEffect(() => {
    setContent({
      text: undefined,
      json: tagSchema,
    });
  }, [tagSchema]);

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


  const updateTagSchema = (tagSchema: TagSchemaType) => {
    function onResponse(res: any) {
      if (res.status === 200) {
        dispatch(
          openNotificationDialog({
            dialogTitle: 'Rule saved successfully',
          })
        );
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
              'Error happened while saving tag schema. Please try again later',
          })
        );
      }
    }

    if (tagSchemaId) {
      // TODO: update tag schema when update method is  ready.
      // DocumentsService.updateTagSchema(tagSchemaId, {tagSchema}, currentSiteId).then(res => {
      //       onResponse(res)
      //       if (res.status === 200) {
      //           dispatch(setTagSchema(res))
      //       } else {
      //           dispatch(openNotificationDialog({dialogTitle: res.errors[0].error}))
      //       }
      //   })
    }
  }

  const saveSchemaInEditor = () => {
    if (content.json && isValidJSON(content.json)) {
      updateTagSchema(content.json)
    } else if (content.text && isValidString(content.text)) {
      updateTagSchema(content.text)
    } else {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please enter valid tag schema value',
        })
      );
    }
  }

  const onDeleteClick = () => {
    if (!tagSchemaId) {
      return;
    }
    const deleteTagSchema = () => {
      DocumentsService.deleteTagSchema(tagSchemaId, currentSiteId).then(res => {
        if (res.status === 200) {
          navigate('/tag-schemas');
        } else {
          dispatch(openNotificationDialog({dialogTitle: "Tag Schema delete failed. Please try again later."}))
        }
      })
    }

    dispatch(openConfirmationDialog({
        dialogTitle: "Are you sure you want to delete this Tag Schema?",
        callback: deleteTagSchema
      })
    )
  }

  const handleChange = (value: any) => {
    if (value.json) {
      setContent(value);
    } else if (value.text) {
      setContent(value);
    }
  }
  const closeEditor = () => {
    searchParams.delete("editor")
    setSearchParams(searchParams)

  }

  return (
    <>
      <Helmet>
        <title>Tag Schema</title>
      </Helmet>

      {tagSchema ? (editor ?
          <div
            className="flex flex-col "
            style={{
              height: `calc(100vh - 3.68rem)`,
            }}
          >
            <div className="w-full py-2 flex justify-between gap-2 mt-2 px-4">
              <div className="flex gap-2 items-end">
                <button onClick={closeEditor}
                        className="h-8 text-neutral-900 bg-neutral-200 hover:bg-neutral-300 rounded-md p-2 flex items-center gap-2 mr-2 whitespace-nowrap font-bold text-sm"
                        title="Close Editor"
                >
                  Close Editor
                  <div className="w-4 h-4"><Close/></div>
                </button>
                <NavLink to={"/tag-schemas"} className="h-6 text-neutral-900 hover:text-primary-500 "
                >
                  Return to Tag Schemas
                </NavLink>
              </div>

              <div className="flex gap-2">
                {/*Uncomment when update method is ready.*/}

                {/*<button*/}
                {/*  onClick={saveSchemaInEditor}*/}
                {/*  className="h-7 w-7 text-neutral-900 hover:text-primary-500"*/}
                {/*  title="Save"*/}
                {/*>*/}
                {/*  <Save/>*/}
                {/*</button>*/}
                <button className="h-6 text-neutral-900 hover:text-primary-500" title="Delete Tag Schema" type="button"
                        onClick={onDeleteClick}><Trash/>
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
          </div> : <div className="p-4">
            <TagSchemaMenu tagSchema={tagSchema} updateTagSchema={updateTagSchema}
                           deleteTagSchema={onDeleteClick}/>
            <p className="text-neutral-900 text-md font-bold my-4">
              Composite Keys
            </p>
            <CompositeKeysTable compositeKeys={tagSchema.tags.compositeKeys}/>

            <p className="text-neutral-900 text-md font-bold my-4">
              Required Tags
            </p>
            <TagsTable tags={tagSchema.tags.required}/>

            <p className="text-neutral-900 text-md font-bold my-4">
              Optional Tags
            </p>
            <TagsTable tags={tagSchema.tags.optional}/>

          </div>)
        : <Spinner/>}

    </>
  );
}

export default TagSchema;
