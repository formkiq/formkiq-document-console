import { Plus, Trash } from '../../Icons/icons';

type Props = {
  siteId: string;
  isSiteReadOnly: boolean;
  onNewClick: any;
  webhooks: null | [];
  onDelete: (webhookId: string, siteId: string) => void;
};

export function WebhookList({
  siteId,
  isSiteReadOnly,
  onNewClick,
  webhooks,
  onDelete,
}: Props) {
  const onDeleteClick = (webhookId: string, siteId: string) => () => {
    onDelete(webhookId, siteId);
  };

  return (
    <>
      {!isSiteReadOnly && (
        <div className="mt-4 flex px-4">
          <button
            className="flex bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold rounded-md flex cursor-pointer focus:outline-none py-2 px-4"
            data-test-id="create-webhook"
            onClick={(event) => onNewClick(event, siteId)}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </button>
        </div>
      )}
      <div className="mt-4 mb-8">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-100 text-left font-bold border-slate-300 text-transparent">
            <tr>
              <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Name
              </th>
              <th className="w-3/4 border-b border-t p-4 py-3  bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                URL
              </th>
              <th className="w-1/8 border-b border-t p-4 pr-8 py-3  bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white nodark:bg-slate-800">
            {webhooks && (webhooks as any).length ? (
              <>
                {(webhooks as any).map((webhook: any, i: number) => {
                  return (
                    <tr key={i} data-test-id={`webhook-${webhook.name}`} className="border-slate-300 text-neutral-900">
                      <td className="border-b p-4 pl-8">
                        {webhook.name}
                      </td>
                      <td className="border-b p-4 ">
                        {webhook.url}
                      </td>
                      <td className="border-b p-4 pr-8 ">
                        <button
                          onClick={onDeleteClick(webhook.id, siteId)}
                          data-test-id="delete-webhook"
                          className="w-4 h-auto  mr-3 hover:text-primary-500 my-[3px]"
                        >
                          <Trash />
                          <span className="sr-only">Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-2">
                  No webhooks have been found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default WebhookList;
