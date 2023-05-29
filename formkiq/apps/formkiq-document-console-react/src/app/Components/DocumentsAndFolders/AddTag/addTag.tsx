import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { TagsForFilterAndDisplay } from '../../../helpers/constants/primaryTags';
import { DocumentsService } from '../../../helpers/services/documentsService';

export default function AddTag({
  line,
  onTagChange,
  updateTags,
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
  const addTagFormRef = useRef<HTMLFormElement>(null);
  const typeaheadSelectRef = useRef<HTMLSelectElement>(null);
  const [allTagKeys, setAllTagKeys] = useState(null);
  const [typeaheadVisible, setTypeaheadVisible] = useState(false);
  const [typeaheadTagKeys, setTypeaheadTagKeys] = useState([]);

  const onAddTagSubmit = async (data: any) => {
    if (data.key.indexOf('/') > -1) {
      dispatch(
        openDialog({ dialogTitle: 'Tags cannot contain forward slashes.' })
      );
      return;
    }
    DocumentsService.addTag(line.documentId, siteId, data).then((response) => {
      setTimeout(() => {
        updateTags();
      }, 200);
    });
    reset();
    setTimeout(() => {
      onTagChange(line);
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
    setAllTagKeys(null);
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
      setAllTagKeys(tagKeys);
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
    if (typeaheadSelectRef.current && allTagKeys) {
      const startsWith = getValues('key');
      const tagsForTypeahead = (allTagKeys as []).filter((tagKey: any) => {
        if (!startsWith.length || tagKey.value.indexOf(startsWith) === 0) {
          return tagKey.value;
        }
      });
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
      onSubmit={handleSubmit(onAddTagSubmit)}
      className="w-full"
      ref={addTagFormRef}
    >
      <div className="flex items-start relative w-full">
        <div className="w-48 mr-2">
          <input
            aria-label="Tag Key"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-1 py-1 border border-gray-600
                              text-sm
                              placeholder-gray-500 text-gray-900 rounded-t-md
                              focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
            placeholder="new tag"
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
            className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-xs font-semibold py-1.5 px-3 rounded-2xl flex cursor-pointer"
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
