import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ConfigState } from '../../../Store/reducers/config';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { IDocument } from '../../../helpers/types/document';
import { ILine } from '../../../helpers/types/line';
import { Close, Spinner } from '../../Icons/icons';

interface Option {
  value: string;
  label: string;
}

interface SubmitForReviewModalProps {
  isOpened: boolean;
  onClose: () => void;
  siteId: string;
  value: ILine | null;
  onDocumentDataChange: any;
}

interface FormData {
  option: string;
  customOptions: string[];
}

const options: Option[] = [
  {
    value: 'test',
    label: 'Test',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
];

const standardOptions: Option[] = [
  { value: 'test', label: 'Submit to Yourself (TEST)' },
];

const customOptions: Option[] = [
  { value: 'test', label: 'Submit to Yourself (TEST)' },
];

export default function SubmitForReviewModal({
  isOpened,
  onClose,
  siteId,
  value,
  onDocumentDataChange,
}: SubmitForReviewModalProps): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useAppDispatch();
  const [formActive, setFormActive] = useState<boolean>(true);
  const [isSpinnerDisplayed, setIsSpinnerDisplayed] = useState(false);

  const { formkiqVersion } = useSelector(ConfigState);

  const selectedOption = watch('option');

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
    }
  }, [isOpened]);

  const closeDialog = useCallback((): void => {
    setFormActive(false);
    reset();
    setIsSpinnerDisplayed(false);
    setTimeout(() => {
      onDocumentDataChange();
    }, 1500);
    onClose();
  }, [reset, onDocumentDataChange, onClose]);

  const searchDocument = useCallback(
    (data: FormData, documentId: string) => {
      let intervalId: NodeJS.Timeout;
      let attempts = 0;
      const maxAttempts = 30;

      const searchAttributes = [
        {
          key: 'Relationships',
          eq: 'PRIMARY#' + documentId,
        },
      ];

      const searchAndProcess = () => {
        DocumentsService.searchDocuments(
          siteId,
          formkiqVersion,
          null,
          '',
          0,
          undefined,
          undefined,
          searchAttributes
        )
          .then((response) => {
            if (response.documents.length > 0) {
              clearInterval(intervalId);
              setIsSpinnerDisplayed(false);

              const newName: string =
                (value?.documentInstance as IDocument).path + '.pdf';
              DocumentsService.renameDocument(
                response.documents[0].documentId,
                response.documents[0].documentId,
                newName
              );

              let workflowId = '';
              switch (data.option) {
                case 'test':
                  console.log('test');
                  workflowId = '';
                  break;
                case 'custom':
                  console.log('custom');
                  workflowId = '';
                  break;
              }

              DocumentsService.addWorkflowToDocument(
                siteId,
                response.documents[0].documentId,
                workflowId
              );

              closeDialog();
            } else {
              attempts++;
              if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('Document search timed out');
                setIsSpinnerDisplayed(false);
                // Handle timeout (e.g., show an error message to the user)
              }
            }
          })
          .catch((error) => {
            console.error('Error searching documents:', error);
            clearInterval(intervalId);
            setIsSpinnerDisplayed(false);
            // Handle error (e.g., show an error message to the user)
          });
      };

      intervalId = setInterval(searchAndProcess, 500);

      // Clear interval after component unmounts or dialog closes
      return () => clearInterval(intervalId);
    },
    [siteId, formkiqVersion, value, closeDialog]
  );

  const onSubmit: SubmitHandler<FormData> = (data: FormData): void => {
    if (formActive && value) {
      setIsSpinnerDisplayed(true);
      if (data.customOptions && data.customOptions.length > 0) {
        const actions = [
          {
            type: 'PDFEXPORT',
          },
        ];
        DocumentsService.postDocumentActions(value.documentId, actions, siteId);
        searchDocument(data, value.documentId);
      }
      console.log(data);
    }
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={(): void => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-1/2 h-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
                      Submit
                      {value && value.lineType === 'folder' ? (
                        <span> Folder </span>
                      ) : (
                        <span> Document </span>
                      )}
                      For Review
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full mt-4"
                  >
                    <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                      <div className="w-full mr-12">
                        <select
                          {...register('option', { required: true })}
                          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                        >
                          <option value="">Select an option</option>
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors.option && (
                          <span className="text-red-500 text-sm">
                            You must choose one or more reviewers.
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedOption === 'test' && (
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <div className="space-y-2">
                            {standardOptions.map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  {...register('customOptions')}
                                  value={option.value}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="pl-2">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOption === 'custom' && (
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <div className="space-y-2">
                            {customOptions.map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  {...register('customOptions')}
                                  value={option.value}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="pl-2">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="w-full flex justify-center">
                      <button
                        type="submit"
                        className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none mr-2"
                      >
                        Send for Review
                      </button>
                      <button
                        type="button"
                        onClick={closeDialog}
                        className="bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                    {isSpinnerDisplayed && (
                      <div
                        className="absolute"
                        style={{ right: 'calc(50% - 110px)', top: '5px' }}
                      >
                        <Spinner />
                      </div>
                    )}
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
