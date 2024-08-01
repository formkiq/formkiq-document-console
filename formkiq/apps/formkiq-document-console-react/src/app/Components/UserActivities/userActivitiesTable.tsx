import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentsService } from '../../helpers/services/documentsService';
import { formatDate, getFileIcon } from '../../helpers/services/toolService';
import { UserActivity } from '../../helpers/types/userActivities';

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
      // create array of unique user ids
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
      // create array of unique document ids
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

  return (
    <table className="w-full border-collapse text-sm table-fixed ">
      <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
        <tr>
          <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Document
          </th>
          <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            User
          </th>
          <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Activity
          </th>
          <th className=" w-full border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Time
          </th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {userActivities && userActivities.length > 0 ? (
          <>
            {userActivities.map((activity: UserActivity, i) => {
              return (
                <tr
                  key={'activity_' + i}
                  className="text-neutral-900 border-b border-neutral-300"
                >
                  <td className="p-4 pl-8 truncate">
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
                  <td className="p-4 ">
                    {users[activity.userId]?.email || activity.userId}
                  </td>
                  <td className="p-4 ">{activity.type}</td>
                  <td className="p-4 ">{formatDate(activity.insertedDate)}</td>

                  <td className="p-4 pr-8">
                    <div className="flex items-center justify-end gap-2 mr-3"></div>
                  </td>
                </tr>
              );
            })}
          </>
        ) : (
          <tr>
            <td colSpan={3} className="text-center p-2">
              No activities found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserActivitiesTable;
