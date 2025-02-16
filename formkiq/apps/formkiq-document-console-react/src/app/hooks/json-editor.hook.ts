import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Schema } from '../helpers/types/schemas';

export const useJsonEditor = ({ schema }: { schema: Schema | null }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const editor = searchParams.get('jsonEditor');
  const editing = searchParams.get('editing');

  // JSON editor
  const [content, setContent] = useState({
    text: undefined,
    json: schema,
  });

  const [isEditing, setIsEditing] = useState(editing === 'true');

  const handleChange = (value: any) => {
    if (value?.json || value?.text) {
      setContent(value);
    }
  };

  const closeEditor = () => {
    searchParams.delete('jsonEditor');
    searchParams.delete('editing');
    setSearchParams(searchParams);
  };

  const schemaMenuEditClick = () => {
    searchParams.set('editing', 'true');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setIsEditing(searchParams.get('editing') === 'true');
  }, [searchParams]);

  return {
    content,
    setContent,
    editor,
    editing,
    isEditing,
    handleChange,
    closeEditor,
    schemaMenuEditClick,
  };
};
