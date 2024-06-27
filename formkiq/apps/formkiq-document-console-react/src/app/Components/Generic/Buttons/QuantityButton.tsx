/* Display a quantity amount, eg: (3) */ 
function QuantityButton(props: any){
    return(
        <button {...props}
            className={"h-full bg-white text-primary-500 px-1 font-bold whitespace-nowrap hover:bg-neutral-200 transition duration-100 rounded-md " + props.className}>
            {"("+ props.children + ")"}
        </button>
      );
}
export default QuantityButton;