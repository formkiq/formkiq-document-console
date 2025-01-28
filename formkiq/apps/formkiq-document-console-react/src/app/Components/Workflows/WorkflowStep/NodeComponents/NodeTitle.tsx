function NodeTitle({title, icon }: {title: string, icon: any}) {
  return (
    <>
      <div
        className="p-1 tracking-normal font-bold bg-blue-100 flex border-t border-gray-700 border flex-row items-start">
        <div className="w-6 mr-1 mt-1">{icon}</div>
        {title}
      </div>
    </>
  );
}

export default NodeTitle;
