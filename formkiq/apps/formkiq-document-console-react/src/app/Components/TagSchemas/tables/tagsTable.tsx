type TagsTableProps = {
  tags: {
    key: string;
    defaultValues: string[];
    allowedValues: string[];
  }[]
}

function TagsTable({tags}: TagsTableProps) {
  return (
    <table
      className="w-full border-collapse text-sm table-fixed border border-neutral-300 "
    >
      <thead
        className="w-full bg-neutral-100 z-10 pt-2 border-b border-t text-transparent font-bold text-left border-neutral-300">
      <tr>
        <th
          className=" w-6 border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600"></th>
        <th
          className=" w-full  border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">Key
        </th>
        <th
          className=" w-full  border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">Default Value
        </th>
        <th
          className=" w-full  border-b border-t p-4 py-3 bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">Allowed Values
        </th>
      </tr>
      </thead>
      <tbody>
      {tags.length > 0 ? tags.map((tag, index) => (
          <tr key={"compositeKey_" + index} className="text-neutral-900 border-neutral-300 text-left">
            <td className="w-6 text-center border-b">
              {index + 1}
            </td>
            <td className="border-b p-4">{tag.key}</td>
            <td className="border-b p-4">{tag.defaultValues.join(', ')}</td>
            <td className="border-b p-4">{tag.allowedValues.join(', ')}</td>
          </tr>
        )) :
        <tr className="text-neutral-900 border-neutral-300">
          <td className="w-6 text-center border-b"></td>
          <td className=" text-center border-b p-4">
            No tags have been added yet
          </td>
        </tr>}
      </tbody>
    </table>
  );
}

export default TagsTable;
