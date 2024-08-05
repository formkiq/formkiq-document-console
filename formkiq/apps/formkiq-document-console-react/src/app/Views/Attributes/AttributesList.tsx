import {useAppDispatch} from '../../Store/store';
import {useEffect, useRef} from "react";

type Props = {
  siteId: string;
  attributes: any[];
  onDelete: (workflowId: string, siteId: string) => void;
  onAttributeInView: (key: string) => void;
  isAttributesInUse: Record<string, boolean>;
};

export function AttributesList({
                                 siteId,
                                 attributes,
                                 onDelete,
                                 onAttributeInView,
                                 isAttributesInUse,
                               }: Props) {
  const dispatch = useAppDispatch();

  const onDeleteClick = (attributeKey: string, siteId: string) => () => {
    onDelete(attributeKey, siteId);
  };

  const tableRef = useRef(null);


  const handleIntersection = (entries: any[]) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        // check if in view
        if (!entry.target.id|| entry.target.id === '') return;
        onAttributeInView(entry.target.id);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Adjust threshold as needed
    });

    const table: any = tableRef.current;
    const tableRows = table ? table.querySelectorAll('tr') : [];
    tableRows?.forEach((row: any) => observer.observe(row));

    return () => {
      observer.disconnect();
    };
  }, [attributes]);

  return (
    <>
      <div
        className="flex-1 inline-block overflow-y-scroll overflow-x-auto h-full w-full"
      >
        <table
          ref={tableRef}
          className="box-content table-auto text-sm border-b border-l border-r border-neutral-300 w-full border-spacing-0"
          id="workflowsScrollPane"
        >
          <thead className="bg-neutral-100 text-start h-10 sticky top-0 text-transparent whitespace-nowrap">
          <tr>
            <th
              className="text-start border-b border-t border-neutral-300 p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Key
            </th>
            <th
              className="text-start border-b border-t border-neutral-300 p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Data Type
            </th>
            <th
              className="text-start border-b border-t border-neutral-300 p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Type
            </th>
            <th
              className="text-start border-b border-t border-neutral-300 p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              In Use
            </th>
            <th
              className="text-start border-b border-t border-neutral-300 p-4 pl-8 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white nodark:bg-slate-800">
          {attributes && attributes.length ? (attributes.map((attribute: any, i: number) => {
              return (
                <tr id={attribute.key} key={`attribute-${attribute.key}`}>
                  <td
                    className="font-bold border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                    {attribute.key}
                  </td>
                  <td
                    className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                    {attribute.dataType}
                  </td>
                  <td
                    className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                    {attribute.type}
                  </td>
                  <td
                    className="border-b border-neutral-300 nodark:border-slate-700 p-4 pl-8 text-neutral-900 nodark:text-slate-400">
                    {isAttributesInUse[attribute.key]===true ? 'Yes' : isAttributesInUse[attribute.key]===false ? 'No' : 'Loading...'}
                  </td>
                  <td
                    className="border-b border-neutral-300 nodark:border-slate-700 p-4 pr-8 text-neutral-900 nodark:text-slate-400">
                    actions
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-2">
                No attributes have been found
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AttributesList;
