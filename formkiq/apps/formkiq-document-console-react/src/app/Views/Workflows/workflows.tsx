import { Helmet } from 'react-helmet-async';
import { ComingSoon } from '../../Components/Icons/icons';

export function Workflows() {
  return (
    <>
      <Helmet>
        <title>Workflows</title>
      </Helmet>
      <div className="max-w-screen-lg text-center font-semibold mb-4">
        <div className="flex ml-2 pb-8 grow justify-center">
          <div className="w-24">
            <ComingSoon />
          </div>
        </div>
        You will be able to set up workflows in the Document Console beginning
        with FormKiQ Version 1.10
      </div>
    </>
  );
}

export default Workflows;
