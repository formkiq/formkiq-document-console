import { isValidElement, useState } from 'react';
import { ArrowBottom, ArrowRight } from '../../../Components/Icons/icons';

type ApiSegmentProps = {
  children: React.ReactNode;
  title: React.ReactNode;
};

export const ApiSegment = (props: ApiSegmentProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex justify-end mt-3 mr-1">
          {expanded ? <ArrowBottom /> : <ArrowRight />}
        </div>
        {isValidElement(props.title) ? (
          props.title
        ) : (
          <div className="uppercase font-semibold text-base">{props.title}</div>
        )}
      </div>

      {expanded && props.children}
    </>
  );
};
