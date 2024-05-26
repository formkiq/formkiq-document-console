function DisplayValue({description, value}: {
  description: string, value: string
}) {
  return (
    <div className="my-2">
      <div className="text-gray-600 text-sm">
        {description}:{' '}
        <span className="text-sm text-gray-800 font-medium ">
          {value?value:'-'}
        </span>
      </div>
    </div>
  );
}

export default DisplayValue;
