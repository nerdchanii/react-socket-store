# react-socket-store
[![npm version](https://badge.fury.io/js/react-socket-store.svg)](https://badge.fury.io/js/react-socket-store)

It is for easily using Websocket in React. It inspired by [React-redux](https://github.com/reduxjs/react-redux).<br>
It is provider of [socket-store](https://github.com/nerdchanii/socket-store).

`react-socket-store` depends on the public `socket-store` package contract. Its source imports runtime values and store contract types from the `socket-store` package root, not from generated `socket-store/dist/*` build paths.

Full guides live in [docs/public](./docs/public/).

## Quick Start


### 1. Install


```bash
#npm

npm install react-socket-store socket-store

#yarn

yarn add react-socket-store socket-store
```



### 2. Create MessageHandler(s), and Socket Store


MesssageHandler and Socket store is based on [socket-store](https://github.com/nerdchanii/socket-store).

- [createMessageHandler](#2-1-create-messagehandler)
- [SocketStore](#2-2-create-socketstore)

#### 2-1. Create MessageHandler


First, create a message handler.<br>
Define the topic, callback for the topic, and default status. This will be provided in the store.

- createMessageHandler(key, callback, state)
  - `key` : it will be subject of message.
  - `callback`: it will works like reducer. it **_must return state!_**
  - `state`: it is defualt state.

```ts
import { createMessageHandler } from "react-socket-store";

const talkHandler = createMessageHandler<string[], string>(
  "talk",
  (state, data) => {
    return [...state, data];
  },
  []
);
```



#### 2-2. Create SocketStore


Next, create a socket store.<br>
Store gets two or three parameters for web sockets and message handlers.
1. `WebSocket instance`,
2. `array of message handler`,
3. `options` options has callbacks about connection status.

- new SocketStore(ws: WebSocket, messageHandlers: MessageHandler[], options?: SocketStoreOptions)

```ts
import { SocketStore } from "react-socket-store";

const socketStore = new SocketStore(new WebSocket("ws://localhost:3000"), [
  talkHandler,
]);
```


#### 2-3. Provider


- Wrap your `<App>` with `<SocketProvider>`, and provide a previously created store as a prop for the socket provider.

```tsx
import type { ReactNode } from "react";
import { SocketProvider, type ISocketStore } from "react-socket-store";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

function AppRoot({
  store,
  children,
}: {
  store: ISocketStore<ChatSchema>;
  children: ReactNode;
}) {
  return (
    <SocketProvider<ChatSchema> store={store}>
      {children}
    </SocketProvider>
  );
}
```



### 3. Use SocketStore with Hook


we supply API for using SocketStore, by hooks.

- [useSocket](#3-1-usesocket)
- [useSend](#3-2-usesend)
- [useListen](#3-3-uselisten)



#### 3-1. useSocket

`useSocket` gets the parameter for the key of the MessageHandler, and returns the state, and sendfunction for the key.

```tsx
import { FormEvent, useState } from "react";
import { useSocket } from "react-socket-store";

function ChatBox() {
  const [value, setValue] = useState("");
  const [messages, sendTalk] = useSocket<ChatSchema, "talk">("talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk(value);
    setValue("");
  }

  return (
    <>
      <div>
        {messages.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
      <form onSubmit={submit}>
        <input value={value} onChange={(event) => setValue(event.target.value)} />
      </form>
    </>
  );
}
```

For topic-safe state and send payloads, provide a schema type:

```tsx
type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
  trade: {
    state: string | null;
    payload: string;
  };
};

const [messages, sendTalk] = useSocket<ChatSchema, "talk">("talk");

sendTalk("hello");
// TypeScript error: "talk" payloads must be strings.
sendTalk(123);
```


#### 3-2. useSend

`useSend` gets the paramerter for the key of the MessageHandler, and returns
  only sendfunction for the key.

```tsx
import { FormEvent, useState } from "react";
import { useSend } from "react-socket-store";

function SendBox() {
  const [value, setValue] = useState("");
  const [sendTalk] = useSend<ChatSchema, "talk">("talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk(value);
  }

  return (
    <form onSubmit={submit}>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
    </form>
  );
}
```


#### 3-3. useListen

`useListen` gets the paramerter for the key of the MessageHandler, and returns
  only state for the key.

```tsx
import { useListen } from "react-socket-store";

function MessageList() {
  const [messages] = useListen<ChatSchema, "talk">("talk");

  return (
    <div>
      {messages.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  );
}
```

The README examples are mirrored by `test-d/readme.test-d.tsx`.



## Contributors 👏🏻
<br/>

## LICENSE
<br/>
 MIT
