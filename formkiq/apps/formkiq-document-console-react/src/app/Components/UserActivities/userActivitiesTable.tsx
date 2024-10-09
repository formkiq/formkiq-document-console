import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentsService } from '../../helpers/services/documentsService';
import { formatDate, getFileIcon } from '../../helpers/services/toolService';
import { UserActivity } from '../../helpers/types/userActivities';
import { ChevronDown } from '../Icons/icons';

type UserActivitiesTableProps = {
  userActivities: UserActivity[];
  siteId: string;
  documentsRootUri: string;
};

function UserActivitiesTable({
  userActivities,
  siteId,
  documentsRootUri,
}: UserActivitiesTableProps) {
  const [documents, setDocuments] = useState<any>({});
  const [users, setUsers] = useState<any>({});
  const [showDetailsIds, setShowDetailsIds] = useState<string[]>([]);

  async function getUser(id: string) {
    DocumentsService.getUser(id).then((res) => {
      if (res.status === 200 && res.user) {
        setUsers((value: any) => ({ ...value, [id]: res.user }));
      } else {
        setUsers((value: any) => ({ ...value, [id]: null }));
      }
    });
  }

  useEffect(() => {
    if (userActivities && userActivities.length > 0) {
      const userIds = userActivities.map(
        (activity: UserActivity) => activity.userId
      );
      const uniqueUserIds = userIds.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      uniqueUserIds.forEach((id: string) => {
        if (users[id] === undefined) {
          getUser(id);
        }
      });
    }
  }, [userActivities]);

  async function getDocument(id: string) {
    DocumentsService.getDocumentById(id, siteId).then((res) => {
      if (res.status === 200) {
        setDocuments((value: any) => ({ ...value, [id]: res }));
      } else {
        setDocuments((value: any) => ({ ...value, [id]: null }));
      }
    });
  }

  useEffect(() => {
    if (userActivities && userActivities.length > 0) {
      const documentIds = userActivities.map(
        (activity: UserActivity) => activity.activityId
      );
      const uniqueDocumentIds = documentIds.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      uniqueDocumentIds.forEach((id: string) => {
        if (documents[id] === undefined) {
          getDocument(id);
        }
      });
    }
  }, [userActivities]);

  function toggleShowDetails(id: string) {
    console.log(id);
    if (showDetailsIds.includes(id)) {
      setShowDetailsIds(showDetailsIds.filter((value) => value !== id));
    } else {
      setShowDetailsIds([...showDetailsIds, id]);
    }
  }

  return (
    <table className="w-full border-collapse text-xs table-fixed">
      <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
        <tr>
          <th className="w-1/2 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Document
          </th>
          <th className="w-1/4 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            User
          </th>
          <th className="w-1/4 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Time
          </th>
          <th className="w-1/8 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Activity
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {userActivities && userActivities.length > 0 ? (
          <>
            {userActivities.map((activity: UserActivity, i) => (
              <>
                <tr
                  key={'activity_' + i}
                  className="text-neutral-900 border-t border-neutral-300"
                >
                  <td
                    className={`pt-4 pl-8 truncate ${
                      !activity.document ? 'pb-4' : ''
                    } `}
                  >
                    {documents[activity.activityId]?.path ? (
                      <Link
                        to={`${documentsRootUri}/${activity.activityId}/view`}
                        className="cursor-pointer hover:text-primary-500"
                      >
                        <img
                          src={getFileIcon(
                            documents[activity.activityId].path,
                            documents[activity.activityId].deepLinkPath
                          )}
                          className="w-8 mr-2 inline-block"
                          alt="icon"
                        />
                        {documents[activity.activityId]?.path}
                      </Link>
                    ) : (
                      <p>
                        <img
                          src={getFileIcon(activity.activityId, '')}
                          className="w-8 mr-2 inline-block"
                          alt="icon"
                        />
                        {activity.activityId}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    {users[activity.userId]?.email || activity.userId}
                  </td>
                  <td className="p-4">{formatDate(activity.insertedDate)}</td>
                  <td className="p-4 font-bold">{activity.type}</td>
                </tr>
                {activity.document && (
                  <>
                    <tr
                      className="cursor-pointer hover:bg-neutral-100 transition-colors duration-150"
                      onClick={() => toggleShowDetails(activity.activityId)}
                    >
                      <td colSpan={4} className="p-2">
                        <div className="flex flex-wrap items-center mx-8 p-2 bg-neutral-50">
                          <span className="font-semibold text-primary-500 hover:text-primary-600 flex gap-2 items-center">
                            {showDetailsIds.includes(activity.activityId) ? (
                              <>
                                Hide Details{''}
                                <div className="rotate-180 h-3">
                                  <ChevronDown />
                                </div>
                              </>
                            ) : (
                              <>
                                Show Details{' '}
                                <div className="h-3">
                                  <ChevronDown />
                                </div>
                              </>
                            )}
                          </span>
                          {showDetailsIds.includes(activity.activityId) && (
                            <div className="w-full mx-8 p-2 bg-neutral-50 overflow-x-auto">
                              <pre>
                                {JSON.stringify(activity.document, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                        <div></div>
                      </td>
                    </tr>
                  </>
                )}
              </>
            ))}
          </>
        ) : (
          <tr>
            <td colSpan={4} className="text-center p-2">
              No activities found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserActivitiesTable;
