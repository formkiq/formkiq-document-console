import { Dialog } from '@headlessui/react';
import { Mode } from 'vanilla-jsoneditor';
import { useSelector } from 'react-redux';

import { JSONEditorReact } from '../../TextEditors/JsonEditor';

import {
  fetchClassifications,
  SchemasState,
} from '../../../Store/reducers/schemas';
import { useAppDispatch } from '../../../Store/store';

import { useJsonEditor } from '../../../hooks/json-editor.hook';
import {
  isValidJSON,
  isValidString,
} from '../../../helpers/utils/json-editor-validators';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Schema as SchemaType } from '../../../helpers/types/schemas';
import { useEffect } from 'react';

type CreateSchemaJsonDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
};

const CreateSchemaJsonDialog = ({
  isOpen,
  setIsOpen,
  siteId,
}: CreateSchemaJsonDialogPropsType) => {
  const { classificationSchema } = useSelector(SchemasState);
  const dispatch = useAppDispatch();

  const { content, setContent, handleChange } = useJsonEditor({
    schema: classificationSchema,
  });

  useEffect(() => {
    setContent({
      text: undefined,
      json: classificationSchema,
    });
  }, [classificationSchema, setContent]);

  const createSchemaJson = (newSchema: SchemaType) => {
    DocumentsService.addSiteClassification(siteId, {
      classification: newSchema,
    }).then((response) => {
      if (response.classificationId) {
        dispatch(fetchClassifications({ siteId, limit: 20, page: 1 }));
        setIsOpen(false);
      } else {
        dispatch(
          openNotificationDialog({ dialogTitle: response.errors[0].error })
        );
      }
    });
  };

  const saveSchemaInEditor = () => {
    if (content.json && isValidJSON(content.json)) {
      createSchemaJson(content.json);
    } else if (content.text && isValidString(content.text)) {
      createSchemaJson(JSON.parse(content.text));
    } else {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please enter valid schema value',
        })
      );
    }
  };

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => null}
          className="relative z-20 text-neutral-900"
          static
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="w-full max-w-3xl min-h-32 bg-white p-6 rounded-md flex flex-col">
              <Dialog.Title className="text-2xl font-bold mb-4 text-center">
                Create New Schema by JSON
              </Dialog.Title>

              <div className="inline-block h-full w-full flex-grow">
                <JSONEditorReact
                  content={content}
                  mode={Mode.text}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-between gap-4 text-base font-bold mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-10 border border-neutral-900 px-4 rounded-md"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  onClick={saveSchemaInEditor}
                  className="h-10 bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 rounded-md"
                >
                  + CREATE
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default CreateSchemaJsonDialog;
