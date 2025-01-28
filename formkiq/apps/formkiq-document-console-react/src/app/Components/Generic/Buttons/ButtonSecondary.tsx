function ButtonSecondary(props: any) {
  return (
    <button {...props}
            className={"h-full bg-white text-neutral-900 border border-primary-500 px-4 font-bold whitespace-nowrap hover:text-primary-500 transition duration-100 rounded-md " + props.className}>
      {props.children}
    </button>
  );
}

export default ButtonSecondary;
