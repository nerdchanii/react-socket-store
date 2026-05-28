import { FormEvent, useState } from "react";
import {
  SocketProvider,
  SocketStore,
  createMessageHandler,
  useListen,
  useSend,
  useSocket,
  useSocketStoreRef,
} from "../src";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

const talkHandler = createMessageHandler<string[], string>(
  "talk",
  (state, message) => [...state, message],
  []
);

const chatStore = new SocketStore(new WebSocket("ws://localhost:3000"), [
  talkHandler,
]);

function AppRoot() {
  return (
    <SocketProvider<ChatSchema> store={chatStore}>
      <ChatBox />
    </SocketProvider>
  );
}

function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, sendTalk] = useSocket<ChatSchema, "talk">("talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk(message);
    setMessage("");
  }

  return (
    <form onSubmit={submit}>
      {messages.map((entry) => (
        <p key={entry}>{entry}</p>
      ))}
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function DirectChatBox() {
  const [message, setMessage] = useState("");
  const store = useSocketStoreRef(() => chatStore);
  const [messages, sendTalk] = useSocket<ChatSchema, "talk">(store, "talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk(message);
    setMessage("");
  }

  return (
    <form onSubmit={submit}>
      {messages.map((entry) => (
        <p key={entry}>{entry}</p>
      ))}
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function SplitHooks() {
  const [messages] = useListen<ChatSchema, "talk">("talk");
  const [sendTalk] = useSend<ChatSchema, "talk">("talk");

  sendTalk("hello");

  return <p>{messages.join(", ")}</p>;
}

void AppRoot;
void DirectChatBox;
void SplitHooks;
