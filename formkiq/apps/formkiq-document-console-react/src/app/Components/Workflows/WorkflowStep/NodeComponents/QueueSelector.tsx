import {Listbox} from "@headlessui/react";
import {Step} from "../../../../helpers/types/workflows";
import {RootState, useAppDispatch} from "../../../../Store/store";
import {useCallback, useEffect, useState} from "react";
import {useSelector} from 'react-redux';
import {ChevronRight} from "../../../Icons/icons";
import {RequestStatus} from "../../../../helpers/types/queues";
import {fetchQueues, setQueuesLoadingStatusPending} from "../../../../Store/reducers/queues";
import DisplayValue from "./DisplayValue";

const QueueSelector = ({
                         newStep,
                         setNewStep,
                         siteId,
                         isEditing,
                         queue,
                       }: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
  siteId: string;
  isEditing: boolean;
  queue: any
}) => {

  const {
    queues,
    nextQueuesToken,
    queuesLoadingStatus,
    currentQueuesSearchPage,
    isLastQueuesSearchPageLoaded,
    isLoadingMore,
  } = useSelector((state: RootState) => state.queuesState);

  const dispatch = useAppDispatch();
  const [isQueueSelectorOpen, setIsQueueSelectorOpen] = useState(false);
  const [queueValue, setQueueValue] = useState<string>('Select...');

  // load queues
  useEffect(() => {
    if (
      newStep
    ) {
      setIsQueueSelectorOpen(true);
      dispatch(fetchQueues({siteId}));
    } else {
      setIsQueueSelectorOpen(false);
    }
  }, [newStep, siteId]);

  // update selected queue name
  useEffect(() => {
    const newStepQueue = queues.find(
      (queue) => queue.queueId === newStep?.queue?.queueId
    )?.name;
    if (newStepQueue) {
      setQueueValue(newStepQueue);
    } else {
      setQueueValue('Select...');
    }
  }, [newStep, queues]);

  const handleSelectQueue = (id: string) => {
    if (!newStep) return;
    const step: Step = {...newStep};
    if (step.queue) {
      step.queue = {
        ...step.queue,
        queueId: id,
      };
    } else {
      step.queue = {
        queueId: id,
        approvalGroups: [],
      };
    }
    setNewStep(step);
  };

  // load more queues when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('queuesScrollPane');

    if (
      isBottom(scrollpane as HTMLElement) &&
      nextQueuesToken &&
      queuesLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setQueuesLoadingStatusPending());
      if (nextQueuesToken) {
        await dispatch(
          fetchQueues({
            siteId,
            nextQueuesToken,
            page: currentQueuesSearchPage + 1,
          })
        );
      }
    }
  }, [nextQueuesToken, queuesLoadingStatus, isLastQueuesSearchPageLoaded]);

  const handleScroll = (event: any) => {
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
      }
    }
  };

  return (
    <>{isEditing ? (
      isQueueSelectorOpen &&
      (queues && queues.length > 0 ? (
        <div>
          <div className="text-sm text-gray-800 mt-4 mb-2">Queue:</div>
          <Listbox
            value=""
            onChange={(value: string) => handleSelectQueue(value)}
          >
            <Listbox.Button
              className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag nowheel">
              <span className="block truncate">{queueValue}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <div className="rotate-90 w-4">
                    <ChevronRight/>
                  </div>
                </span>
            </Listbox.Button>
            <Listbox.Options
              id="queuesScrollPane"
              onScroll={handleScroll}
              className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel"
            >
              {queues.map((queue) => (
                <Listbox.Option
                  key={queue.queueId}
                  value={queue.queueId}
                  className={({active}) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                >
                  {queue.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      ) : (
        <p> No queues found. </p>
      ))
    ) : (
      <>
        <DisplayValue description={"Queue"} value={queue}/>
      </>
    )}
    </>
  );
};

export default QueueSelector;
