type EmptyDocumentsTableProps = {
  subfolderUri: string;
  queueId: string;
  formkiqVersion: any;
};

export const EmptyDocumentsTable = ({
  subfolderUri,
  queueId,
  formkiqVersion,
}: EmptyDocumentsTableProps) => {
  // TODO: "React-ify"
  document.getElementById('emptyDocumentsTable')?.classList.add('hidden');
  setTimeout(() => {
    document.getElementById('emptyDocumentsTable')?.classList.remove('hidden');
  }, 400);

  return (
    <div
      id="emptyDocumentsTable"
      className="hidden text-center mt-4 justify-center"
    >
      <div role="status">
        <div className="overflow-x-auto flex justify-center">
          {queueId.length ? (
            <div className="mt-4 w-2/3 p-2 border border-gray-400 rounded-md text-gray-900 font-semibold bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300">
              <h3 className="text-lg mb-4">
                No documents are currently waiting in this queue
              </h3>
            </div>
          ) : (
            <>
              {subfolderUri.length ? (
                <span>
                  No subfolders or files have been found in this folder
                </span>
              ) : (
                <div className="mt-4 w-2/3 p-2 border border-gray-400 rounded-md text-gray-900 font-semibold bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300">
                  <h3 className="text-lg mb-4">
                    No documents or folders found
                  </h3>
                  <p>
                    You can create and upload folders and documents using the
                    buttons on the sidebar.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
