import React from "react";

type Props = {
  children: React.ReactNode;
};

const ChatContainer = (props: Props) => {
  return (
    <div className="flex h-full justify-center flex-col relative">
      {props.children}
    </div>
  );
};

export default ChatContainer;
