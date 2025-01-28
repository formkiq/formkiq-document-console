function ButtonPrimary(props: any) {
  return (
    <button {...props}
            className={"h-full bg-primary-500 hover:bg-primary-600 text-white px-4 font-bold whitespace-nowrap transition duration-100 rounded-md " + props.className}>
      {props.children}
    </button>
  );
}

export default ButtonPrimary;
