function ButtonPrimaryGradient(props: any) {
  return (
    <button {...props}
           className={"h-full bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 font-bold whitespace-nowrap transition duration-100 rounded-md " + props.className}
    >
      {props.children}
    </button>
  );
}

export default ButtonPrimaryGradient;
