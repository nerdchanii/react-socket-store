import {
  SocketProvider,
  useListen,
  useSend,
  useSocket,
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

const [tradeState] = useListen<SocketSchema, "trade">("trade");
const checkedTradeState: number | null = tradeState;

const [sendTrade] = useSend<SocketSchema, "trade">("trade");
sendTrade(1);

useSocket("fallback-topic")[1]({ loose: "payload" });

// @ts-expect-error topic keys are constrained when a schema is provided
useListen<SocketSchema>("missing");

// @ts-expect-error payload type follows the selected topic
sendTalk(123);

// @ts-expect-error send payload follows the selected topic
sendTrade("not a number");

void checkedMessages;
void checkedTradeState;
