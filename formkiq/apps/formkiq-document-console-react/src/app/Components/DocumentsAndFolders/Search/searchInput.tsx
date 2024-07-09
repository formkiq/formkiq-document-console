import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import { ConfigState } from '../../../Store/reducers/config';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { formatDate, getFileIcon } from '../../../helpers/services/toolService';
import { IDocument } from '../../../helpers/types/document';
import { FolderSolid, MoreActions, Search, Spinner } from '../../Icons/icons';
import AdvancedSearchModal from './advancedSearchModal';
import {AttributesDataState} from "../../../Store/reducers/attributesData";

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

export default function SearchInput({
  onChange,
  onKeyDown,
  siteId,
  documentsRootUri,
  value,
}: any) {
  const search = useLocation().search;
  const advancedSearch = new URLSearchParams(search).get('advancedSearch');
  const [expanded, setExpanded] = useState(false);
  const [documents, setDocuments] = useState(null);
  const [isAdvancedSearchModalOpened, setAdvancedSearchModalOpened] =
    useState(false);
  const [isSearchAvailable, setIsSearchAvailable] = useState<boolean>(false);
  const navigate = useNavigate();

  const { formkiqVersion, useAdvancedSearch } = useSelector(ConfigState);
  const {allTags, allAttributes} = useSelector(AttributesDataState);
  const [searchParams, setSearchParams] = useSearchParams();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setExpanded);

  useEffect(() => {
    if (value) {
      // TODO: allow search across all sites and/or specify site
      // TODO: verify version modules and determine search function to use (DynamoDB, Typesense, OpenSearch)
      DocumentsService.searchDocuments(
        siteId,
        formkiqVersion,
        null,
        value,
        1,
        allTags,
        allAttributes
      ).then((response: any) => {
        if (response?.documents) {
          const temp: any = [];
          response.documents?.forEach((el: IDocument) => {
            if (el.documentId) {
              el.insertedDate = moment(el.insertedDate).format(
                'YYYY-MM-DD HH:mm'
              );
              el.lastModifiedDate = moment(el.lastModifiedDate).format(
                'YYYY-MM-DD HH:mm'
              );
              temp.push(el);
            }
          });
          setDocuments(temp);
          setIsSearchAvailable(true);
        } else if (response.status === 400) {
          setIsSearchAvailable(false);
        }
      });
    }
  }, [value, siteId]);

  const onAdvancedSearchModalClick = (event: any) => {
    setAdvancedSearchModalOpened(true);
  };
  const onAdvancedSearchModalClose = () => {
    setAdvancedSearchModalOpened(false);
  };

  const DocumentsPreview = () => {
    if (documents) {
      const docs = documents as [];
      if (docs?.length > 0) {
        return (
          <React.Fragment>
            {docs.map((file: any, i: number) => {
              return documentLine(file, i);
            })}
          </React.Fragment>
        );
      } else {
        return (
          <div className="text-center">
            <div role="status">
              <div className="overflow-x-auto relative">No documents...</div>
            </div>
          </div>
        );
      }
    } else if (!isSearchAvailable) {
      return (
        <div className="text-center text-gray-500">
          Search Currently Unavailable
        </div>
      );
    } else {
      return <Spinner />;
    }
  };

  const close = () => {
    setExpanded(false);
  };
  const documentLine = (file: any, i: number) => {
    return (
      <li
        className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
        key={i}
      >
        <Link
          to={`${documentsRootUri}/${file.documentId}/view`}
          className="cursor-pointer w-full"
          onClick={close}
        >
          <div className={'fex flex-col'}>
            <div className="inline-block w-8 mr-2 align-text-bottom">
              <img
                src={getFileIcon(file.path)}
                className="w-8 mr-2 inline-block"
                alt="icon"
              />
            </div>
            <div className="inline-block">
              <div className="flex">{file.path}</div>
              <div className="flex text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-4 mr-1">
                    <FolderSolid />
                  </div>
                </div>
                <div className="mr-4">Files</div>
                <div>Updated {formatDate(file.insertedDate)}</div>
              </div>
            </div>
          </div>
        </Link>
      </li>
    );
  };

  const SearchForFilesAndFolders = () => {
    setExpanded(false);
    navigate(`${documentsRootUri}?searchWord=${value}`);
  };

  const SearchForFilesOnly = () => {
    setExpanded(false);
    navigate(`${documentsRootUri}?searchWord=${value}&searchTargets=files`);
  };

  const SearchForFoldersOnly = () => {
    setExpanded(false);
    navigate(`${documentsRootUri}?searchWord=${value}&searchTargets=folders`);
  };

  function expand(ev: any) {
    if (ev.key === 'Enter' || !value) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
    if (onKeyDown) {
      onKeyDown(ev);
    }
  }

  // toggle advanced search pane
  const toggleAdvancedSearch = () => {
    if (advancedSearch) {
      searchParams.delete('advancedSearch');
      setSearchParams(searchParams);
    } else {
      searchParams.set('advancedSearch', 'visible');
      setSearchParams(searchParams);
    }
  };

  return (
    <div className={'relative w-full'} ref={wrapperRef}>
      <div className="flex items-center">
        <div
          _ngcontent-wxp-c51=""
          className="grow md:flex md:items-center rounded-md mt-2 mb-4 mt-2.5 relative bg-neutral-100 "
        >
          <div className="w-4 ml-2">
            <Search></Search>
          </div>
          <input
            onChange={onChange}
            onKeyDown={expand}
            onClick={expand}
            value={value}
            aria-label="text"
            type="text"
            placeholder="Search"
            className="block w-full appearance-none bg-transparent py-2 pl-4 pr-12 text-base text-neutral-900 placeholder:text-neutral-600 focus:outline-none sm:text-sm sm:leading-6 border-none focus:outline-none focus:ring-0"
          />
        </div>
        {!advancedSearch &&
          <div className="grow-0 ml-2 -mt-1">
            <button
              className="bg-neutral-100 border hover:bg-neutral-200 text-smaller text-neutral-600 font-semibold pt-2 pb-1.5 px-2 rounded"
              onClick={toggleAdvancedSearch}
            >
              <div className="w-4">
                <MoreActions/>
              </div>
            </button>
          </div>}
      </div>
      {expanded && (
        <div className="w-full absolute -mt-2 z-30 bg-white border shadow-xl">
          <ul
            className="max-h-[18.375rem] overflow-y-auto rounded-b-lg bg-white text-sm leading-6"
            role="listbox"
            id="headlessui-combobox-options-651"
          >
            {useAdvancedSearch && (
              <>
                <li
                  className="flex items-center p-4 hover:bg-neutral-100 cursor-pointer"
                  onClick={SearchForFoldersOnly}
                >
                  <span className={'mr-2'}>
                    <Search></Search>
                  </span>
                  <span className="whitespace-nowrap text-base text-neutral-900">
                    {' '}
                    Search folders for {value}
                  </span>
                </li>
                <li
                  className="flex items-center p-4 hover:bg-neutral-100 cursor-pointer"
                  onClick={SearchForFilesOnly}
                >
                  <span className={'mr-2'}>
                    <Search></Search>
                  </span>
                  <span className="whitespace-nowrap text-base text-neutral-900">
                    {' '}
                    Search files for {value}
                  </span>
                </li>
              </>
            )}
            <DocumentsPreview />
          </ul>
          {isSearchAvailable && (
            <div className="px-4 py-2">
              <button
                className="w-full bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded flex justify-center"
                onClick={SearchForFilesAndFolders}
              >
                See all results
              </button>
            </div>
          )}
          <div className="hidden mb-2 flex justify-center">
            <div className="pt-0.5">
              <input id="searchCurrentFolderOnly" type="checkbox" />
            </div>
            <div>
              <label className="text-sm pl-2" htmlFor="searchCurrentFolderOnly">
                search current folder only
              </label>
            </div>
          </div>
        </div>
      )}
      <AdvancedSearchModal
        isOpened={isAdvancedSearchModalOpened}
        onClose={onAdvancedSearchModalClose}
        siteId={siteId}
      />
    </div>
  );
}
