import { Trash } from '../../Icons/icons';
import { Webhook } from '../../../helpers/types/webhooks';

type Props = {
  siteId: string;
  handleScroll: (event: any) => void;
  webhooks: Webhook[];
  onDelete: (webhookId: string, siteId: string) => void;
};

export function WebhookList({
  siteId,
  handleScroll,
  webhooks,
  onDelete,
}: Props) {
  const onDeleteClick = (webhookId: string, siteId: string) => () => {
    onDelete(webhookId, siteId);
  };

  return (
    <div
      className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full w-full"
      onScroll={handleScroll}
    >
      <table className="w-full border-collapse text-sm" id="webhooksScrollPane">
        <thead className="bg-neutral-100 text-left font-bold border-slate-300 text-transparent">
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
                  <tr
                    key={i}
                    data-test-id={`webhook-${webhook.name}`}
                    className="border-slate-300 text-neutral-900"
                  >
                    <td className="border-b p-4 pl-8">{webhook.name}</td>
                    <td className="border-b p-4 ">{webhook.url}</td>
                    <td className="border-b p-4 pr-8 ">
                      <button
                        onClick={onDeleteClick(webhook.webhookId, siteId)}
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
  );
}

export default WebhookList;
