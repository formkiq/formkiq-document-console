import { Trash } from '../../Icons/icons';
import { ApiKey } from '../../../helpers/types/apiKeys';

type Props = {
  siteId: string;
  apiKeys: ApiKey[];
  onDelete: (apiKey: string, siteId: string) => void;
  handleScroll: (event: any) => void;
};

export function ApiKeyList({ siteId, apiKeys, onDelete, handleScroll }: Props) {
  const onDeleteClick = (apiKey: string, siteId: string) => () => {
    onDelete(apiKey, siteId);
  };

  return (
    <>
      <div
        className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full w-full"
        onScroll={handleScroll}
      >
        <table
          className="w-full border-collapse text-sm table-auto "
          id="apiKeysScrollPane"
        >
          <thead className="bg-neutral-100 font-bold border-neutral-300 text-left text-transparent">
            <tr>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Name
              </th>
              <th className="w-3/4 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Key
              </th>
              <th className="w-3/4 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Permissions
              </th>
              <th className="w-3/4 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white nodark:bg-slate-800">
            {apiKeys && (apiKeys as any).length ? (
              <>
                {(apiKeys as any).map((apiKey: any, i: number) => {
                  return (
                    <tr
                      key={i}
                      data-test-id={`apikey-${apiKey.name}`}
                      className="text-neutral-900"
                    >
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8">
                        {apiKey.name}
                      </td>
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4">
                        {apiKey.apiKey}
                      </td>
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4">
                        {(apiKey as any).permissions &&
                        (apiKey as any).permissions.length ? (
                          <>
                            {(apiKey as any).permissions.map(
                              (permission: any, j: number) => {
                                return (
                                  <span
                                    key={j}
                                    className="inline-block mx-1 rounded-md border border-neutral-300 px-1"
                                  >
                                    {permission}
                                  </span>
                                );
                              }
                            )}
                          </>
                        ) : (
                          <span>No permissions found</span>
                        )}
                      </td>
                      <td className="border-b border-neutral-300 nodark:border-slate-700 p-4 pr-8 text-neutral-900 nodark:text-slate-400">
                        <button
                          onClick={onDeleteClick(apiKey.apiKey, siteId)}
                          data-test-id="delete-api-key"
                        >
                          <div className="h-5 hover:text-primary-500 transition duration-100">
                            <Trash />
                            <span className="sr-only">Delete</span>
                          </div>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-2">
                  No API Keys have been found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ApiKeyList;
