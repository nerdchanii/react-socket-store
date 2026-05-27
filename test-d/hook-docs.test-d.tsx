import { FormEvent, useEffect, useState } from "react";
import {
  SocketProvider,
  SocketStore,
  createMessageHandler,
  useListen,
  useSend,
  useSocket,
  useSocketStoreRef,
  type ISocketStore,
} from "../src";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

type RouterMessage = {
  id: string;
  text: string;
};

type RouterChatSchema = {
  talk: {
    state: RouterMessage[];
    payload: RouterMessage;
  };
};

declare const store: ISocketStore<ChatSchema>;
declare function useLoaderData<TLoader extends (...args: never[]) => unknown>(): Awaited<
  ReturnType<TLoader>
>;

function SocketHookExample() {
  const [messages, sendTalk] = useSocket<ChatSchema, "talk">("talk");

  sendTalk("hello");

  return <p>{messages.join(", ")}</p>;
}

function DirectSocketHookExample() {
  const directStore = useSocketStoreRef(() => store);
  const [messages, sendTalk] = useSocket(directStore, "talk");

  sendTalk("hello");

  return <p>{messages.join(", ")}</p>;
}

function DirectSplitHookExample({ store }: { store: ISocketStore<ChatSchema> }) {
  const [messages] = useListen(store, "talk");
  const [sendTalk] = useSend(store, "talk");

  return (
    <button type="button" onClick={() => sendTalk("hello")}>
      {messages.join(", ")}
    </button>
  );
}

async function reactRouterLoader() {
  const response = await fetch("/api/chat");
  const initialMessages: RouterMessage[] = await response.json();

  return { initialMessages };
}

function ReactRouterChatRoute() {
  const { initialMessages } = useLoaderData<typeof reactRouterLoader>();

  return <ReactRouterChatRouteClient initialMessages={initialMessages} />;
}

function ReactRouterChatRouteClient({
  initialMessages,
}: {
  initialMessages: RouterMessage[];
}) {
  const [routeStore, setRouteStore] =
    useState<ISocketStore<RouterChatSchema> | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/chat");
    const nextStore = new SocketStore(socket, [
      createMessageHandler<RouterMessage[], RouterMessage>(
        "talk",
        (messages, message) => [...messages, message],
        [...initialMessages]
      ),
    ]) as unknown as ISocketStore<RouterChatSchema>;

    setRouteStore(nextStore);

    return () => {
      socket.close();
    };
  }, [initialMessages]);

  if (routeStore === null) {
    return <p>Messages: {initialMessages.length}</p>;
  }

  return <ReactRouterChatThread store={routeStore} />;
}

function ReactRouterChatThread({
  store,
}: {
  store: ISocketStore<RouterChatSchema>;
}) {
  const [draft, setDraft] = useState("");
  const [messages, sendTalk] = useSocket(store, "talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk({ id: crypto.randomUUID(), text: draft });
    setDraft("");
  }

  return (
    <form onSubmit={submit}>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}

function ListenHookExample() {
  const [messages] = useListen<ChatSchema, "talk">("talk");

  return <p>{messages.length}</p>;
}

function SendHookExample() {
  const [sendTalk] = useSend<ChatSchema, "talk">("talk");

  sendTalk("hello");

  return null;
}

<SocketProvider<ChatSchema> store={store}>
  <SocketHookExample />
  <ListenHookExample />
  <SendHookExample />
</SocketProvider>;

// @ts-expect-error schema-constrained topic names reject missing topics
useListen<ChatSchema>("missing");

// @ts-expect-error explicit store topics reject missing topics
useSocket(store, "missing");

void SocketHookExample;
void DirectSocketHookExample;
void DirectSplitHookExample;
void ReactRouterChatRoute;
void ReactRouterChatRouteClient;
void ReactRouterChatThread;
void ListenHookExample;
void SendHookExample;
