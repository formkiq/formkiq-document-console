import { useLocation } from 'react-router-dom';
import { Edit, Trash } from '../../Components/Icons/icons';
import { LocaleResourceItem } from '../../helpers/types/locales';
import { useIsReadOnlyUser } from '../../hooks/is-read-only-user.hook';
import { User } from '../../Store/reducers/auth';

type ResourceItemsTableProps = {
  resourceItems: LocaleResourceItem[];
  user: User | null;
  siteId: string;
  onLocaleResourceItemDelete: (itemKey: string) => void;
  showLocaleResourceItemEditTab: (itemKey: string) => void;
  setNewLocaleResourceItemValue: (newValue: {
    resourceItem: LocaleResourceItem;
  }) => void;
};

function ResourceItemsTable({
  resourceItems,
  onLocaleResourceItemDelete,
  showLocaleResourceItemEditTab,
  setNewLocaleResourceItemValue,
  user,
  siteId,
}: ResourceItemsTableProps) {
  const { pathname } = useLocation();
  const isReadOnlyUser = useIsReadOnlyUser({ user, siteId });

  const editResourceItem = (resourceItem: LocaleResourceItem) => {
    showLocaleResourceItemEditTab(resourceItem.itemKey);
    setNewLocaleResourceItemValue({ resourceItem });
  };

  return (
    <table
      className="w-full border-collapse text-sm table-fixed"
      id="resourceItemsTable"
    >
      <thead className="sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t font-bold text-transparent text-left border-neutral-300">
        <tr>
          <th className="w-1/5 border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Item Key
          </th>
          <th className="w-1/5 border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Item Type
          </th>
          <th className="w-2/5 border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Localized Value
          </th>
          <th className="w-1/5 border-b border-t border-neutral-300 p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white nodark:bg-slate-800">
        {resourceItems && resourceItems.length > 0 ? (
          <>
            {resourceItems.map(
              (resourceItem: LocaleResourceItem, index: number) => (
                <tr
                  key={'resourceItem_' + index}
                  className="text-neutral-900 align-top"
                >
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8">
                    {resourceItem.itemKey}
                  </td>
                  <td className="border-b border-neutral-300 p-4">
                    {resourceItem.itemType}
                    {resourceItem.itemType === 'CLASSIFICATION' && (
                      <span className="block text-xs">
                        ({resourceItem.classificationId})
                      </span>
                    )}
                    {resourceItem.attributeKey && (
                      <span className="block pt-2 text-sm">
                        <strong className="font-semibold pr-1">
                          Attribute:
                        </strong>
                        {resourceItem.attributeKey}
                      </span>
                    )}
                    {resourceItem.allowedValue && (
                      <span className="block pt-2 text-sm">
                        <strong className="font-semibold pr-1">
                          Allowed Value:
                        </strong>
                        {resourceItem.allowedValue}
                      </span>
                    )}
                  </td>
                  <td className="border-b border-neutral-300 p-4 pr-8">
                    {resourceItem.localizedValue}
                  </td>
                  <td className="border-b border-neutral-300 p-4">
                    {!isReadOnlyUser && (
                      <div className="flex items-center">
                        <button
                          onClick={() => editResourceItem(resourceItem)}
                          className="w-4 h-auto mr-3 hover:text-primary-500 my-[3px]"
                        >
                          <Edit />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            onLocaleResourceItemDelete(resourceItem.itemKey)
                          }
                          className="w-4 h-auto mr-3 hover:text-primary-500 my-[3px]"
                        >
                          <Trash />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            )}
          </>
        ) : (
          <tr>
            <td colSpan={4} className="text-center p-2">
              No Resource Items have been found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ResourceItemsTable;
