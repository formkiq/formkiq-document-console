import {
  Close,
  EnvelopeClose,
  EnvelopeOpen,
  NotificationRead,
  NotificationUnread,
} from '../Icons/icons';

export default function Notifications(ToggleNotifications: any) {
  return (
    <div className="fixed top-13.5 right-0 w-2/5 border border-gray-100 rounded-lg drop-shadow-xl bg-white z-20">
      <div className="flex p-8">
        <div className="grow font-semibold text-base">Notifications</div>
        <div className="w-20 flex justify-end">
          <div
            className="w-5 h-5 cursor-pointer text-gray-400"
            onClick={ToggleNotifications}
          >
            <Close />
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="w-full border-b"></div>
      </div>
      <div className="flex w-full px-8 py-3">
        <div className="grow text-xs text-primary-500">
          &#10003; Mark all as read
        </div>
        <div className="w-20 text-xs text-gray-400">Delete all</div>
      </div>
      <div className="flex w-full">
        <div className="w-full border-b"></div>
      </div>
      <ul>
        <li className="flex w-full border-b px-8 py-3 bg-gray-100">
          <div className="w-16 flex">
            <div className="w-8 h-8 flex justify-center text-white items-center bg-primary-500 rounded-full">
              <EnvelopeClose />
            </div>
          </div>
          <div className="grow text-sm mx-2">
            <span className="font-semibold text-primary-500">
              Luis Cairampoma
            </span>
            &nbsp; created file &nbsp;
            <span className="font-semibold">
              Screen Shot 2022- 06-20 at 4.15.56 PM.png
            </span>
            &nbsp; in &nbsp;
            <span className="italic text-primary-500">
              Assure Sign (Don't change)
            </span>
          </div>
          <div className="w-20 text-gray-400 mt-1">
            <div className="w-2 border border-gray-400 rounded-full">
              <NotificationUnread />
            </div>
          </div>
        </li>
        <li className="flex w-full border-b px-8 py-3 bg-gray-100">
          <div className="w-16 flex">
            <div className="w-8 h-8 flex justify-center text-white items-center bg-gray-400 rounded-full">
              <EnvelopeOpen />
            </div>
          </div>
          <div className="grow text-sm mx-2">
            <span className="font-semibold text-primary-500">
              Luis Cairampoma
            </span>
            &nbsp; created file &nbsp;
            <span className="font-semibold">
              Screen Shot 2022- 06-20 at 4.15.56 PM.png
            </span>
            &nbsp; in &nbsp;
            <span className="italic text-primary-500">
              Assure Sign (Don't change)
            </span>
          </div>
          <div className="w-20 text-gray-400 mt-1">
            <div className="w-2 border border-gray-400 rounded-full">
              <NotificationRead />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
