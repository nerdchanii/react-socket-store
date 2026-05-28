import {
  SocketProvider,
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

declare const store: ISocketStore<ChatSchema>;

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
void ListenHookExample;
void SendHookExample;
