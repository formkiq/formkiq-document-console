function ButtonTertiary(props: any) {
  return (
    <button {...props}
            className={"h-full bg-neutral-300 hover:bg-neutral-400 text-neutral-900 px-4 font-bold whitespace-nowrap transition duration-100 rounded-md " + props.className}>
      {props.children}
    </button>
  );
}

export default ButtonTertiary;
