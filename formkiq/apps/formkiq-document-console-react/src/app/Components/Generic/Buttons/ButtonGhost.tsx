function ButtonGhost(props: any) {
  return (
    <button {...props}
            className={"h-full text-neutral-900 border border-neutral-500 px-4 font-bold whitespace-nowrap hover:text-primary-500 transition duration-100 " + props.className}>
      {props.children}
    </button>
  );
}

export default ButtonGhost;
