import {
  SocketProvider,
  useListen,
  useSend,
  useSocket,
  useSocketStoreRef,
  type ISocketStore,
} from "../src";

type SocketSchema = {
  talk: {
    state: string[];
    payload: string;
  };
  trade: {
    state: number | null;
    payload: number;
  };
};

declare const store: ISocketStore<SocketSchema>;

<SocketProvider store={store}>
  <div />
</SocketProvider>;

const [messages, sendTalk] = useSocket<SocketSchema, "talk">("talk");
const checkedMessages: string[] = messages;
sendTalk("hello");

const [directMessages, directSendTalk] = useSocket(store, "talk");
const checkedDirectMessages: string[] = directMessages;
directSendTalk("direct");

const [tradeState] = useListen<SocketSchema, "trade">("trade");
const checkedTradeState: number | null = tradeState;

const [directTradeState] = useListen(store, "trade");
const checkedDirectTradeState: number | null = directTradeState;

const [sendTrade] = useSend<SocketSchema, "trade">("trade");
sendTrade(1);

const [directSendTrade] = useSend(store, "trade");
directSendTrade(2);

const stableStore = useSocketStoreRef(() => store);
const checkedStableStore: ISocketStore<SocketSchema> = stableStore;

useSocket("fallback-topic")[1]({ loose: "payload" });

// @ts-expect-error topic keys are constrained when a schema is provided
useListen<SocketSchema>("missing");

// @ts-expect-error explicit store topic keys are constrained by the store schema
useSocket(store, "missing");

// @ts-expect-error payload type follows the selected topic
sendTalk(123);

// @ts-expect-error direct send payload follows the selected topic
directSendTalk(123);

// @ts-expect-error send payload follows the selected topic
sendTrade("not a number");

void checkedMessages;
void checkedDirectMessages;
void checkedTradeState;
void checkedDirectTradeState;
void checkedStableStore;
