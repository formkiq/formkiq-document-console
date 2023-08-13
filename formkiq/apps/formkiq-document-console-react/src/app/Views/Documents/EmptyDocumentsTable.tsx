type EmptyDocumentsTableProps = {
  subfolderUri: string;
  formkiqVersion: any;
};

export const EmptyDocumentsTable = ({
  subfolderUri,
  formkiqVersion,
}: EmptyDocumentsTableProps) => {
  return (
    <div className="text-center mt-4 justify-center">
      <div role="status">
        <div className="overflow-x-auto flex justify-center">
          {subfolderUri.length ? (
            <span>No subfolders or files have been found in this folder</span>
          ) : (
            <div className="mt-4 w-2/3 p-2 border border-gray-400 rounded-md text-gray-900 font-semibold bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300">
              <h3 className="text-lg mb-4">No documents or folders found</h3>
              {formkiqVersion.modules?.indexOf('onlyoffice') > -1 ? (
                <p>
                  You can create folders and documents or upload existing
                  documents using the buttons above.
                </p>
              ) : (
                <p>
                  You can create folders or upload existing documents using the
                  buttons above.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
