import { Link, useLocation } from 'react-router-dom';
import { LocaleResourceItem, Trash } from '../../Components/Icons/icons';
import { User } from '../../Store/reducers/auth';
import { Locale } from '../../helpers/types/locales';
import { useIsReadOnlyUser } from '../../hooks/is-read-only-user.hook';

type LocaleTableProps = {
  user: User | null;
  siteId: string;
  locales: Locale[];
  onLocaleDelete: (locale: string) => void;
  showLocaleEditTab: (locale: Locale) => void;
};

function LocalesTable({
  user,
  siteId,
  locales,
  onLocaleDelete,
  showLocaleEditTab,
}: LocaleTableProps) {
  const pathname = decodeURI(useLocation().pathname);

  const isReadOnlyUser = useIsReadOnlyUser({ user, siteId });

  return (
    <table className="w-full border-collapse text-sm table-fixed ">
      <thead className="w-full sticky top-0 bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
        <tr>
          <th className=" w-full max-w-52 border-b border-t p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
            Locale
          </th>
          <th className=" w-full border-b border-t p-4 pr-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white ">
        {locales && locales.length > 0 ? (
          <>
            {locales.map((locale: Locale) => {
              return (
                <tr
                  key={locale.locale}
                  className="text-neutral-900 border-neutral-300"
                >
                  <td className="border-b max-w-52 border-neutral-300 p-4 pl-8 truncate font-semibold">
                    <Link
                      title={locale.locale}
                      to={`${pathname}/${locale.locale}`}
                      className="cursor-pointer hover:text-primary-500"
                    >
                      {locale.locale}
                    </Link>
                  </td>
                  <td className="border-b p-4 pr-8">
                    {!isReadOnlyUser && (
                      <div className="flex items-center justify-end gap-2 mr-3">
                        <Link
                          to={`${pathname}/${locale.locale}`}
                          className="cursor-pointer w-6 h-auto"
                        >
                          <LocaleResourceItem />
                        </Link>

                        <button
                          title="Delete"
                          onClick={() =>
                            onLocaleDelete(locale.locale as string)
                          }
                          className="w-4 h-auto text-neutral-900 cursor-pointer hover:text-primary-500 my-[3px]"
                        >
                          <Trash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </>
        ) : (
          <tr>
            <td colSpan={3} className="text-center p-2">
              No locales have been added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default LocalesTable;
