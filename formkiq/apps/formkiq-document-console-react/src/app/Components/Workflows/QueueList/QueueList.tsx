import {CopyButton} from '../../../Components/Generic/Buttons/CopyButton';
import ButtonSecondary from '../../Generic/Buttons/ButtonSecondary';
import {Trash} from '../../Icons/icons';

type Props = {
  siteId: string;
  queues: null | [];
  onView: (queueId: string, siteId: string) => void;
  onDelete: (queueId: string, siteId: string) => void;
  handleScroll: (event: any) => void;
};

export function QueueList({
                            siteId,
                            queues,
                            onView,
                            onDelete,
                            handleScroll
                          }: Props) {

  return (
    <>
      <div className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full w-full"
           onScroll={handleScroll}>
        <table className="w-full border-collapse text-sm table-auto "
               id="queuesScrollPane">
          <thead className="sticky top-0 bg-neutral-100 border-neutral-300 font-bold text-transparent text-left">
          <tr>
            <th
              className="w-7/8 border-b p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Name, ID
            </th>
            <th
              className="w-1/8 border-b p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white">
          {queues && (queues as any).length ? (
            <>
              {(queues as any).map((queue: any, i: number) => {
                return (
                  <tr
                    key={i}
                    data-test-id={`queue-${queue.name}`}
                    className="border-neutral-300 text-neutral-900"
                  >
                    <td className="border-b p-4 pl-8">
                      <p className="w-full h-full px-4 py-1 block">{queue.name}</p>
                      <span className="block pl-4 text-xs">
                            {queue.queueId}
                        <span className="pl-2">
                            <CopyButton value={queue.queueId}/>
                          </span>
                        </span>
                    </td>
                    {/*<td className="border-b p-4 pl-8 ">{queue.name}</td>*/}
                    <td className="border-b p-4 pr-8">
                      <div className="flex h-full gap-2">
                        <ButtonSecondary
                          style={{height: '32px'}}
                          onClick={() => onView(queue.queueId, siteId)}
                        >
                          View
                        </ButtonSecondary>
                        <button
                          onClick={() => onDelete(queue.queueId, siteId)}
                          data-test-id="delete-queue"
                          className="w-3 h-auto  mr-3 hover:text-primary-500 my-[3px]"
                        >
                          <Trash/>
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
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
