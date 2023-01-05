import { Trash } from '../../Icons/icons'

export default function ESignatureRecipient(
  {element, index, handleChange, removeFormField}:
  {element: any, index: any, handleChange: any, removeFormField: any}
  ) {
  const deleteRecipient = (event: any, i: any) => {
    removeFormField(i)
  }
  return (
    <>
      <div className="flex mx-4 mb-4 items-center relative">
        <div className="w-32">
          <label className="block text-sm text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
            Name
          </label>
        </div>
        <div className="grow">
          <input
            aria-label="Name"
            type="text"
            name="name"
            required
            value={element.name}
            onChange={e => handleChange(index, e)}
            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
              text-sm
              placeholder-gray-500 text-gray-900 rounded-t-md
              focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
            />
        </div>
        <div className="w-64 pl-4 flex">
          <div>
            <select
              name="type"
              className="bg-transparent"
              value={element.type}
              onChange={e => handleChange(index, e)}
              >
              <option value="signer">Needs to Sign</option>
              <option value="carbonCopy">Receives a Copy</option>
            </select>
          </div>
          <div className="w-16 flex justify-end">
            { (index > 0) && (
              <button
                type="button"
                className="flex justify-center mt-1 text-base text-gray-900 rounded-md mr-2 cursor-pointer"
                onClick={event => deleteRecipient(event, index)}
                >
                <div className="w-4 h-4 text-gray-600">
                  {Trash()}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="md:flex md:items-center mx-4 mb-4 relative">
        <div className="w-32">
          <label className="block text-sm text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
            Email
          </label>
        </div>
        <div className="grow">
          <input
            aria-label="Email"
            name="email"
            type="email"
            required
            value={element.email}
            onChange={e => handleChange(index, e)}
            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
              text-sm
              placeholder-gray-500 text-gray-900 rounded-t-md
              focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          />
        </div>
        <div className="w-64">
        </div>
      </div>
    </>
  )
}