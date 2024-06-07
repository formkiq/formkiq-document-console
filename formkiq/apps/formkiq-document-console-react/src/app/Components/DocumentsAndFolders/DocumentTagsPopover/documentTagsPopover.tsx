import {useEffect, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import {openDialog} from '../../../Store/reducers/globalConfirmControls';
import {useAppDispatch} from '../../../Store/store';
import {DocumentsService} from '../../../helpers/services/documentsService';
import {ILine} from '../../../helpers/types/line';
import {Close, Spinner, Tag} from '../../Icons/icons';
import AddTag from '../AddTag/addTag';
import {DocumentAttribute} from "../../../helpers/types/attributes";

function useOutsideAlerter(ref: any, setExpanded: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

export default function DocumentTagsPopover({
                                              onChange,
                                              onKeyDown,
                                              siteId,
                                              isSiteReadOnly,
                                              value,
                                              tagColors,
                                              onDocumentDataChange,
                                            }: any) {
  const line: ILine = value;
  const [visible, setVisibility] = useState(false);
  const [allTags, setAllTags] = useState(null);
  const [isAttributesLoading, setIsAttributesLoading] = useState(true);
  const [keyOnlyAttributesKeys, setKeyOnlyAttributesKeys] = useState<string[]>([]);
  const [referenceRef, setReferenceRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTagColorEditMode, setIsTagColorEditMode] = useState(false);
  const systemTags = [
    'sysDeletedBy',
    'sysSharedWith',
    'sysFavoritedBy',
    'untagged',
    'path',
  ];

  useEffect(() => {
    // updateTags()
  }, [line]);

  const updateTags = () => {
    if (line) {
      setAllTags(null);
      setIsLoading(true);
      DocumentsService.getDocumentTags(line.documentId as string, siteId).then(
        (data) => {
          setAllTags(
            data?.tags.filter((tag: any) => {
              return systemTags.indexOf(tag.key) === -1;
            })
          );
          setIsLoading(false);
        }
      );
    }
  };
  const onTagDelete = (tagKey: string) => {
    const deleteFunc = () => {
      setAllTags(null);
      DocumentsService.deleteDocumentTag(
        value?.documentId as string,
        siteId,
        tagKey
      ).then(() => {
        setTimeout(() => {
          onDocumentDataChange(value);
        }, 500);
      });
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this tag?',
      })
    );
  };

  const dispatch = useAppDispatch();

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setVisibility);
  const {styles, attributes} = usePopper(referenceRef, popperRef, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [-100, 0],
        },
      },
    ],
  });

  function handleDropdownClick(event: any) {
    updateTags();
    if (visible) {
      setIsTagColorEditMode(false);
    }
    setVisibility(!visible);
  }

  function updateAttributes() {
    DocumentsService.getDocumentAttributes(siteId, null, 20, line?.documentId as string).then((response) => {
      setIsAttributesLoading(false);
      const attributes = response.attributes;
      if (!attributes || attributes.length === 0) return;
      const keyOnlyAttributes: DocumentAttribute[] = []
      attributes.forEach((attribute: DocumentAttribute) => {
        if (attribute.key && !attribute.stringValue && !attribute.numberValue && !attribute.booleanValue && !attribute.stringValues && !attribute.numberValues) {
          keyOnlyAttributes.push(attribute);
        }
      });
      if (!keyOnlyAttributes||keyOnlyAttributes.length === 0) return;
      setKeyOnlyAttributesKeys(keyOnlyAttributes.map(attribute => attribute.key));
    });
  }

  useEffect(() => {
    updateAttributes();
  }, []);

  useEffect(() => {
    updateAttributes()
  }, [value]);

  function onDocumentAttributeDelete(key: string) {

    function deleteAttribute () {
      DocumentsService.deleteDocumentAttribute(siteId, line?.documentId as string, key).then(() => {
        onDocumentDataChange(value);
      });
    }

    dispatch(openDialog({
        callback: deleteAttribute,
        dialogTitle: 'Are you sure you want to delete this attribute?',
    }));

  }


  return (
    <div className="relative" ref={wrapperRef}>
      <button
        ref={setReferenceRef as any}
        onClick={handleDropdownClick}
        className="w-5"
      >
        <Tag/>
      </button>
      {visible && (
        <div
          ref={setPopperRef as any}
          style={styles['popper']}
          {...attributes['popper']}
          className={`bg-white text-gray-900 border-gray-100 border shadow-xl z-10 rounded-xl w-72 text-sm p-2`}
        >
          <div className="mb-2 flex items-center">
            <h2 className="grow text-base font-semibold">Attributes</h2>
          </div>
          <div className="flex flex-wrap">
            {(isLoading || isAttributesLoading) && (
              <div className="w-full flex justify-center">
                <Spinner/>
              </div>
            )}

            {keyOnlyAttributesKeys.length > 0 && keyOnlyAttributesKeys.map((key: any, i: number) => {
              return (
                <div key={i} className="inline">
                  <div className="pt-0.5 pr-1 flex items-center">
                    <div
                      className={`h-5.5 rounded-l-md pr-1 bg-gray-200 flex items-center`}
                    >
                      <span className="p-2">{key}</span>
                      {!isSiteReadOnly && (
                        <button
                          className="pl-1 font-semibold hover:text-red-600"
                          onClick={() => onDocumentAttributeDelete(key)}
                        >
                          <div className="w-3.5 text-gray-600">
                            <Close/>
                          </div>
                        </button>
                      )}
                    </div>
                    <div
                      className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-gray-200`}
                    ></div>
                  </div>
                </div>);
            })}

            {allTags &&
              (allTags as []).map((tag: any, i: number) => {
                let isKeyOnlyTag = false;
                if (
                  (tag.value !== undefined && tag.value.length === 0) ||
                  (tag.values !== undefined && tag.values.length === 0)
                ) {
                  isKeyOnlyTag = true;
                }
                let tagColor = 'gray';
                if (tagColors) {
                  tagColors.forEach((color: any) => {
                    if (color.tagKeys.indexOf(tag.key) > -1) {
                      tagColor = color.colorUri;
                      return;
                    }
                  });
                }
                return (
                  <div key={i} className="inline">
                    {isKeyOnlyTag && (
                      <div className="pt-0.5 pr-1 flex items-center">
                        <div
                          className={`h-5.5 rounded-l-md pr-1 bg-${tagColor}-200 flex items-center`}
                        >
                          <span className="p-2">{tag.key}</span>
                          {!isSiteReadOnly && (
                            <button
                              className="pl-1 font-semibold hover:text-red-600"
                              onClick={(event) => onTagDelete(tag.key)}
                            >
                              <div className="w-3.5 text-gray-600">
                                <Close/>
                              </div>
                            </button>
                          )}
                        </div>
                        <div
                          className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          {!isLoading && !isSiteReadOnly && (
            <div className="mt-4 flex justify-center items-center w-full">
              <AddTag
                line={line}
                onDocumentDataChange={onDocumentDataChange}
                siteId={siteId}
                tagColors={tagColors}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
