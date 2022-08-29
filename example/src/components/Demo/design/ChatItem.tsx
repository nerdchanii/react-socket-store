import React from "react";
import { Conversation } from "./types";

type Props = {
  converstaion: Conversation;
};

const ChatItem = ({ converstaion }: Props) => {
  return (
    <div className="text-left text-2xl py-2 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300">
      <span className="w-fit border-l-2 border-gray-300 text-slate-700 bg-slate-100 py-1 px-2 mr-2 dark:text-slate-200 dark:bg-slate-800">
        {converstaion.name}
      </span>
      <span className=" mx-1">{converstaion.message}</span>
    </div>
  );
};

export default ChatItem;
