import React from "react";
import ChatItem from "./ChatItem";
import { Conversation } from "./types";

type Props = {
  conversations: Array<Conversation>;
};

const ChatConversation = ({ conversations }: Props) => {
  return (
    <div className="h-96 flex flex-col m-2 font-medium overflow-scroll scroll-m-0 scrollbar-hide">
      {conversations.map((conversation) => (
        <ChatItem converstaion={conversation} />
      ))}
    </div>
  );
};

export default ChatConversation;
