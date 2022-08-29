import React, { useRef, useState } from "react";
import ChatContainer from "./design/ChatContainer";
import ChatConversation from "./design/ChatConversation";
import ChatInput from "./design/ChatInput";
import { Conversation } from "./design/types";

type Props = {
  submit: (data: any) => void;
  conversations: Conversation[];
};

const DemoPresenter = ({ submit, conversations }: Props) => {
  const [value, setValue] = useState<string>("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    value && submit(value);
    setValue("");
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex mx-auto my-2 border dark:border-slate-500 dark:text-slate-50 justify-center self-center flex-col sm:w-5/6 lg:w-4/6 xl:w-3/6 ">
      <div>
        <p className="flex-1 text-center text-xl py-4">Chat Demo</p>
      </div>
      <ChatContainer>
        <ChatConversation conversations={conversations} />
        <ChatInput value={value} onChange={onChange} onSubmit={onSubmit} />
      </ChatContainer>
    </div>
  );
};

export default DemoPresenter;
