import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="border pt-8 dark:text-gray-50">
      <h1 className="text-center text-4xl ">React-socket-store</h1>
      <p className="m-2 text-center font-medium text-lg">
        It is React-socket-store.
        <br /> It is for using socket in React easily.
        <br />
        <em>look at this Demo!</em>
      </p>
    </header>
  );
};

export default Header;
