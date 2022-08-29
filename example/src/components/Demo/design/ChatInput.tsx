import React from "react";

type InputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
};

const ChatInput = ({ onChange, onSubmit, value }: InputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className=" w-full absoulte bottom-0  h-fit m-0 p-0 "
    >
      <input
        value={value}
        onChange={onChange}
        className="w-full h-fitleft-0 text-xl p-2 pl-4 border-2  border-slate-50 outline-slate-300 dark:bg-slate-400 dark:outline-slate-300 dark:border-slate-500"
        placeholder="Send a message"
      />
    </form>
  );
};

export default ChatInput;
