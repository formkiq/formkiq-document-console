import RadioListbox from "../../Generic/Listboxes/RadioListbox";
import {useSelector} from "react-redux";
import {AttributesState} from "../../../Store/reducers/attributes";
import {useEffect, useState} from "react";

function AddAttributeForm({onAddAttributeSubmit, register, handleSubmit, addTagFormRef, siteId}: any) {

  const {
    allAttributes,
    allAttributesNextToken,
    allAttributesLoadingStatus,
    allAttributesCurrentSearchPage,
    allAttributesIsLastSearchPageLoaded,
  } = useSelector(AttributesState)


  const [attributeKeys, setAttributeKeys] = useState<string[]>([])
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>("")

  useEffect(() => {
    console.log(allAttributes,'keys')
      if (!allAttributes || allAttributes.length === 0) return
      const keys = allAttributes.map(item => item.key)
      setAttributeKeys(keys)

  }, [allAttributes])

  useEffect(() => {
      dispatch(fetchAllAttributes({
          siteId: siteId,
          page: 1,
          search: ''
      }))
  }, [])


  return (
    <>
      <div className="mt-2 flex justify-center items-center w-full">
        <form
          onSubmit={handleSubmit(onAddAttributeSubmit)}
          className="w-full"
          ref={addTagFormRef}
        >
          <div className="flex items-start mx-4 mb-4 relative w-full">

            <div className="w-52 mr-2">
              <RadioListbox values={attributeKeys} titles ={attributeKeys} selectedValue={selectedAttributeKey} setSelectedValue={setSelectedAttributeKey}/>
            </div>
            {/*<div className="w-48 mr-2">*/}
            {/*  <input*/}
            {/*    aria-label="Tag Key"*/}
            {/*    type="text"*/}
            {/*    required*/}
            {/*    className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600*/}
            {/*                                  text-sm*/}
            {/*                                  placeholder-gray-500 text-gray-900 rounded-t-md*/}
            {/*                                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"*/}
            {/*    placeholder="key"*/}
            {/*    {...register('key', {*/}
            {/*      required: true,*/}
            {/*    })}*/}
            {/*  />*/}
            {/*</div>*/}
            {/*<div className="grow">*/}
            {/*  <input*/}
            {/*    type="text"*/}
            {/*    aria-label="Tag Value"*/}
            {/*    className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600*/}
            {/*                                  text-sm*/}
            {/*                                  placeholder-gray-500 text-gray-900 rounded-t-md*/}
            {/*                                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"*/}
            {/*    placeholder="value (optional)"*/}
            {/*    {...register('value', {*/}
            {/*      required: false,*/}
            {/*    })}*/}
            {/*  />*/}
            {/*</div>*/}
            <div className="flex w-48 justify-start ml-2">
              <input
                type="submit"
                value="Add"
                className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-center w-full">
            <div className="text-sm text-gray-400">
              You can add multiple values by separating each value
              with a comma
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddAttributeForm;
