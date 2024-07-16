import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { AttributesDataState, setAllAttributesData, } from "../../../Store/reducers/attributesData";
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { TagsForFilterAndDisplay } from '../../../helpers/constants/primaryTags';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { Attribute } from '../../../helpers/types/attributes';

export default function AddTag({
  line,
  onDocumentDataChange,
  siteId,
  tagColors,
}: any) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue,
  } = useForm();
  const dispatch = useAppDispatch();
  const addAttributeFormRef = useRef<HTMLFormElement>(null);
  const typeaheadSelectRef = useRef<HTMLSelectElement>(null);
  const [allKeyOnlyAttributeKeys, setAllKeyOnlyAttributeKeys] = useState<
    string[] | null
  >(null);
  const [typeaheadVisible, setTypeaheadVisible] = useState(false);
  const [typeaheadTagKeys, setTypeaheadTagKeys] = useState([]);

  const { allTags, allAttributes } = useSelector(AttributesDataState);

  const updateAllAttributes = () => {
    DocumentsService.getAttributes(siteId).then((response) => {
      if (response.status === 200) {
        const allAttributeData = {
          allAttributes: response?.attributes,
          attributesLastRefreshed: new Date(),
          attributesSiteId: siteId,
        };
        dispatch(setAllAttributesData(allAttributeData));
      }
    });
  };
  const onAddAttributeSubmit = async (data: any) => {
    if (data.key.indexOf('/') > -1) {
      dispatch(
        openDialog({
          dialogTitle: 'Attributes cannot contain forward slashes.',
        })
      );
      return;
    }

    function addDocumentAttribute() {
      const attribute = { attributes: [{ key: data.key }] };
      DocumentsService.addDocumentAttributes(
        siteId,
        'true',
        line.documentId,
        attribute
      ).then((response) => {
        updateAllAttributes();
      });
    }

    // Check if attribute already exists and if it is keyOnly
    DocumentsService.getAttribute(siteId, data.key).then((response) => {
      if (response.status === 200) {
        // Check if attribute is KEY_ONLY
        if (response.attribute.dataType === 'KEY_ONLY') {
          addDocumentAttribute();
        } else {
          dispatch(
            openDialog({
              dialogTitle:
                'Attribute with this key already exists and is not key-only.',
            })
          );
        }
      } else {
        // create new KEY_ONLY attribute
        const attribute: { attribute: Attribute } = {
          attribute: {
            key: data.key,
            dataType: 'KEY_ONLY',
            type: 'STANDARD',
          },
        };
        DocumentsService.addAttribute(siteId, attribute).then((response) => {
          if (response.status === 200) {
            addDocumentAttribute();
          } else {
            dispatch(openDialog({ dialogTitle: 'Failed to add attribute' }));
          }
        });
      }
    });

    reset();
    setTimeout(() => {
      onDocumentDataChange(line);
    }, 500);
  };

  useEffect(() => {
    const systemTags = [
      'sysDeletedBy',
      'sysSharedWith',
      'sysFavoritedBy',
      'untagged',
      'path',
    ];
    setAllKeyOnlyAttributeKeys(null);
    DocumentsService.getAllTagKeys(siteId).then((data) => {
      const tagKeys = data?.values.filter((value: any) => {
        return systemTags.indexOf(value.value) === -1;
      });
      const checkTagKeys = [...tagKeys];

      TagsForFilterAndDisplay.forEach((filterTagKey) => {
        let matchFound = false;
        checkTagKeys.forEach((checkTagKey) => {
          if (checkTagKey.value === filterTagKey) {
            matchFound = true;
            return;
          }
        });
        if (!matchFound) {
          tagKeys.push({
            value: filterTagKey,
          });
        }
      });

      updateAllAttributes();
      setTimeout(() => {
        const keyOnlyAttributes: Attribute[] = allAttributes.filter(
          (attribute: any) => {
            return attribute.dataType === 'KEY_ONLY';
          }
        );
        if (!keyOnlyAttributes || keyOnlyAttributes.length === 0) {
          setAllKeyOnlyAttributeKeys(tagKeys);
        } else {
          const keyOnlyAttributesKeys: { value: string }[] =
            keyOnlyAttributes.map((attribute: Attribute) => {
              return { value: attribute.key };
            });
          setAllKeyOnlyAttributeKeys([...keyOnlyAttributesKeys, ...tagKeys]);
        }
      }, 500);
    });
  }, []);

  const toggleTypeahead = (show = false, hide = false) => {
    if (!typeaheadVisible) {
      getTypeaheadTags();
    }
    if (show) {
      setTypeaheadVisible(true);
    } else if (hide) {
      setTypeaheadVisible(false);
    } else {
      setTypeaheadVisible(!typeaheadVisible);
    }
  };

  const getTypeaheadTags = () => {
    if (typeaheadSelectRef.current && allKeyOnlyAttributeKeys) {
      const startsWith = getValues('key');
      const tagsForTypeahead = (allKeyOnlyAttributeKeys as []).filter(
        (tagKey: any) => {
          if (!startsWith.length || tagKey.value.indexOf(startsWith) === 0) {
            return tagKey.value;
          }
        }
      );
      setTypeaheadTagKeys(tagsForTypeahead);
    }
  };

  const setAddTagValue = (event: any) => {
    if (typeaheadSelectRef.current) {
      setValue(
        'key',
        typeaheadSelectRef.current.options[
          typeaheadSelectRef.current.selectedIndex
        ].value
      );
      toggleTypeahead(false, true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onAddAttributeSubmit)}
      className="w-full"
      ref={addAttributeFormRef}
    >
      <div className="flex items-start relative w-full">
        <div className="w-48 mr-2">
          <input
            aria-label="Attribute Key"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-1 py-1 border border-gray-600
                              text-sm
                              placeholder-gray-500 text-gray-900 rounded-t-md
                              focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            placeholder="new tag attribute"
            autoComplete="off"
            onFocus={(event) => toggleTypeahead(true)}
            onKeyUp={getTypeaheadTags}
            {...register('key', {
              required: true,
            })}
          />
        </div>
        <div>
          <input
            type="submit"
            value="Add"
            className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-xs font-semibold py-1.5 px-3 rounded-2xl flex cursor-pointer"
          />
        </div>
      </div>
      <div className={'mx-2 mt-1 w-56 ' + (typeaheadVisible ? '' : 'hidden')}>
        <select
          size={4}
          ref={typeaheadSelectRef}
          className="w-full border rounded-md cursor-pointer"
          onChange={(event) => setAddTagValue(event)}
        >
          {(typeaheadTagKeys as []).map((tagKey: any, i: number) => {
            let tagColor = 'gray';
            if (tagColors) {
              tagColors.forEach((color: any) => {
                if (color.tagKeys.indexOf(tagKey.value) > -1) {
                  tagColor = color.colorUri;
                  return;
                }
              });
            }
            return (
              <option
                key={i}
                value={tagKey.value}
                className={`my-0.5 mx-1 p-1 bg-${tagColor}-200`}
              >
                {tagKey.value}
              </option>
            );
          })}
        </select>
      </div>
    </form>
  );
}
