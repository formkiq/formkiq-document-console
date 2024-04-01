import {Plus, Trash} from '../../Icons/icons';
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import ButtonSecondary from "../../Generic/Buttons/ButtonSecondary";

type Props = {
  siteId: string;
  isSiteReadOnly: boolean;
  onNewClick: any;
  queues: null | [];
  onDelete: (queueId: string, siteId: string) => void;
};

export function QueueList({
  siteId,
  isSiteReadOnly,
  onNewClick,
  queues,
  onDelete,
}: Props) {
  const onDeleteClick = (queueId: string, siteId: string) => () => {
    onDelete(queueId, siteId);
  };

  return (
    <>
      {!isSiteReadOnly && (
        <div className="mt-4 flex px-4">
          <ButtonPrimaryGradient
            data-test-id="create-queue"
            onClick={(event:any) => onNewClick(event, siteId)}
            className="flex items-center"
            style={{height: '36px'}}
          >
            <span>Create new</span>
            <div className="w-3 h-3 ml-1.5 mt-1">{Plus()}</div>
          </ButtonPrimaryGradient>
        </div>
      )}
      <div className="mt-4 mb-8">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-100 border-neutral-300 font-bold text-transparent text-left">
            <tr>
              <th className="w-1/8 border-b p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Name
              </th>
              <th className="w-1/8 border-b p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {queues && (queues as any).length ? (
              <>
                {(queues as any).map((queue: any, i: number) => {
                  return (
                    <tr key={i} data-test-id={`queue-${queue.name}`} className="border-neutral-300 text-neutral-900">
                      <td className="border-b  p-4 pl-8 ">
                        {queue.name}
                      </td>
                      <td className="border-b  p-4 pr-8 flex gap-2">
                        <ButtonSecondary
                        style={{height:'32px'}}>
                          View
                        </ButtonSecondary>
                        <button
                          onClick={onDeleteClick(queue.queueId, siteId)}
                          data-test-id="delete-queue"
                          className="w-3 h-auto  mr-3 hover:text-primary-500 my-[3px]"
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
                  No queues have been found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default QueueList;
