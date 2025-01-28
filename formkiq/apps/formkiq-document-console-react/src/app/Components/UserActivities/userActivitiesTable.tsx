import React, { useEffect, useState } from 'react';
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

// Separate ActivityRow component to handle individual show/hide state
const ActivityRow = ({
  activity,
  documents,
  users,
  documentsRootUri,
}: {
  activity: UserActivity;
  documents: { [key: string]: any };
  users: { [key: string]: any };
  documentsRootUri: string;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <React.Fragment>
      {/* Main Activity Row */}
      <tr className="text-neutral-900 border-t border-neutral-300">
        <td
          className={`pt-4 pl-8 truncate ${!activity.document ? 'pb-4' : ''}`}
        >
          {activity.document?.path ? (
            <Link
              to={`${documentsRootUri}/${activity.document.documentId}/view`}
              className="cursor-pointer hover:text-primary-500"
            >
              <img
                src={getFileIcon(
                  activity.document.path || '',
                  activity.document.deepLinkPath || ''
                )}
                className="w-8 mr-2 inline-block"
                alt="icon"
              />
              {activity.document.path}
            </Link>
          ) : activity.document?.documentId ? (
            <Link
              to={`${documentsRootUri}/${activity.document.documentId}/view`}
              className="cursor-pointer hover:text-primary-500"
            >
              {documents[activity.document.documentId] ? (
                <>
                  <img
                    src={getFileIcon(
                      documents[activity.document.documentId]?.path || '',
                      documents[activity.document.documentId]?.deepLinkPath ||
                        ''
                    )}
                    className="w-8 mr-2 inline-block"
                    alt="icon"
                  />
                  {documents[activity.document.documentId]?.path || ''}
                </>
              ) : (
                <span>Document not available</span>
              )}
            </Link>
          ) : (
            <span>(no document metadata)</span>
          )}
        </td>
        <td className="p-4">
          {users[activity.userId]?.email || activity.userId}
        </td>
        <td className="p-4">{formatDate(activity.insertedDate)}</td>
        <td className="p-4 font-bold">{activity.type}</td>
      </tr>

      {/* Show/Hide Details Row */}
      {activity.document && (
        <tr
          className="cursor-pointer hover:bg-neutral-100 transition-colors duration-150"
          onClick={() => setShowDetails(!showDetails)}
        >
          <td colSpan={4} className="p-2">
            <div className="flex flex-wrap items-center mx-8 p-2 bg-neutral-50">
              <span className="font-semibold text-primary-500 hover:text-primary-600 flex gap-2 items-center">
                {showDetails ? (
                  <>
                    Hide Details
                    <div className="rotate-180 h-3">
                      <ChevronDown />
                    </div>
                  </>
                ) : (
                  <>
                    Show Details
                    <div className="h-3">
                      <ChevronDown />
                    </div>
                  </>
                )}
              </span>
              {showDetails && (
                <div className="w-full mx-8 p-2 bg-neutral-50 overflow-x-auto">
                  <pre>{JSON.stringify(activity.document, null, 2)}</pre>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

function UserActivitiesTable({
  userActivities,
  siteId,
  documentsRootUri,
}: UserActivitiesTableProps) {
  const [documents, setDocuments] = useState<{ [key: string]: any }>({});
  const [users, setUsers] = useState<{ [key: string]: any }>({});

  // Fetch user data
  async function getUser(id: string) {
    if (id !== 'System') {
      try {
        const res = await DocumentsService.getUser(id);
        if (res.status === 200 && res.user) {
          setUsers((prev) => ({ ...prev, [id]: res.user }));
        } else {
          setUsers((prev) => ({ ...prev, [id]: null }));
        }
      } catch (error) {
        setUsers((prev) => ({ ...prev, [id]: null }));
      }
    } else {
      setUsers((prev) => ({ ...prev, [id]: null }));
    }
  }

  useEffect(() => {
    if (userActivities && userActivities.length > 0) {
      const userIds = userActivities.map(
        (activity: UserActivity) => activity.userId
      );
      const uniqueUserIds = Array.from(new Set(userIds));
      uniqueUserIds.forEach((id: string) => {
        if (users[id] === undefined) {
          getUser(id);
        }
      });
    }
  }, [userActivities, users]);

  // Fetch document data
  async function getDocument(id: string) {
    try {
      const res = await DocumentsService.getDocumentById(id, siteId);
      if (res.documentId) {
        setDocuments((prev) => ({ ...prev, [id]: res }));
      } else {
        setDocuments((prev) => ({ ...prev, [id]: null }));
      }
    } catch (error) {
      setDocuments((prev) => ({ ...prev, [id]: null }));
    }
  }

  useEffect(() => {
    if (userActivities && userActivities.length > 0) {
      const activitiesToFetch = userActivities.filter(
        (activity: UserActivity) => !activity.document?.path
      );
      const documentIds = activitiesToFetch.map(
        (activity: UserActivity) => activity.document?.documentId
      );
      const filteredDocumentIds: string[] = documentIds.filter(
        (id): id is string => id !== undefined && id !== null
      );
      const uniqueDocumentIds = Array.from(new Set(filteredDocumentIds));
      uniqueDocumentIds.forEach((id: string) => {
        if (documents[id] === undefined) {
          getDocument(id);
        }
      });
    }
  }, [userActivities, documents, siteId]);

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
          userActivities.map((activity: UserActivity) => (
            <ActivityRow
              key={activity.activityId}
              activity={activity}
              documents={documents}
              users={users}
              documentsRootUri={documentsRootUri}
            />
          ))
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
