import { Helmet } from "react-helmet-async"
import { NavLink } from "react-router-dom"

const Page404 = ({}) => {

  return (
    <>
      <Helmet>
        <title>404</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row">
        <div className="pt-24 h-screen flex-1 bg-white p-5">
          <div className="font-bold text-lg text-center mb-8">
            404
          </div>
          <div className="font-bold text-lg text-center mb-8">
          <NavLink
            to="/documents"
            >
              <button className="bg-coreOrange-500 hover:bg-coreOrange-700 text-white font-bold py-2 px-4 rounded">
                Home
              </button>          
          </NavLink>
          </div>
      </div>
    </div>
    </>
  )
}

export default Page404