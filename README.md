# react-socket-store

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fnerdchanii%2Freact-socket-store&count_bg=%2357644D&title_bg=%23389008&icon=&icon_color=%23A86F6F&title=hits&edge_flat=true)](https://github.com/nerdchanii)
<br/>
It is for easily using Websocket in React.It inspired by [React-redux](https://github.com/reduxjs/react-redux).
It is provider of [socket-store](https://github.com/nerdchanii/socket-store)

## Quick Start

---

### 1. install

<br>

```bash
#npm

npm install react-socket-store

#yarn

yarn install react-socket-store
```

<br/>
<br/>

### 2. create MessageHandler(s), and Socket Store

MesssageHandler and Socket store is based on [socket-store](https://github.com/nerdchanii/socket-store)

- [createMessageHandler](#2-1-createmessagehandler)
- [createSocketStore](#2-2-create-socketstore)

<br/>

#### 2-1 createMessageHandler

<br>

First, create a message handler. <br> Define the topic, callback for the topic, and default status. This will be provided in the store.<br>

- createMessageHandler(key, callback, state)<br>
  - key : it will be subject of message.
  - callback: it will works like reducer. it **_must return state!_**
  - state: it is defualt state.
    <br>

```ts
const talkHandler = createMessageHandler<string[], string>(
  "talk",
  (state, data) => {
    return [...state, data];
  },
  []
);
```

<br>
<br>

#### 2-2 create SocketStore
<br>

Next, create a socket store.<br>
Store gets two parameters for web sockets and message handlers.

```ts
import { createMessageHandler } from 'react-socket-store';

// it is socket-store's apis
// handlers = you can uses like this.
const talkHandler = createMessageHandler(key, callback, []);
const tradingHandler = createMessageHandler(key, callback, null);

const socket = new WebSocket("ws://localhost:3030");
const store = new SocketStore(socket, [talkHandler, tradingHandler]);
```

<br>
<br>

#### 2-3 Provider

<br>

- Wrap your `<App>` with `<SocketProvider>`, And provide a previously created store as a prop for the socket provider.
  <br>

```tsx
import { SocketProvider } from "react-socket-store";
import store from "./store";

const Index = (prop: Props) => {
  return (
    <SocketProvider store={store}>
      <App />
    </SocketProvider>
  );
};
```
<br>
<br>

#### 3. Use SocketStore with Hook

<br>

we supply API for using SocketStore, by hooks.

- [useSocket](#usesocket)
- [useSend](#usesend)
- [useListen](#uselisten)
  <br>
  <br>

##### useSocket

<br>

- useSocket gets the parameter for the key of the MessageHandler, and returns the state, and sendfunction for the key.

```tsx
const Component = (props: ComponentsProps)=>{
  const [value, setValue] = useState('');
  const [state, send] = useSocket('talk');

  const onChange = (e)=>{
    setValue(e.target.value);
  }

  const submit = (e)=>{
    e.preventDefault();
    send(value);
  }

  return (
    <>
    <div>
    {state.map(message)=> <span>{message}</span>}
    </div>
    <form onSubmit={submit}>
      <input value={value} onChange={onChange} />
    </form>
    </>

  )
}
```

<br>

##### useSend

<br>

- useSend gets the paramerter for the key of the MessageHandler, and returns
  only sendfunction for the key.

```tsx
const Component = (props: ComponentsProps) => {
  const [value, setValue] = useState("");
  const [send] = useSocket("talk");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    send(value);
  };

  return (
    <>
      <form onSubmit={submit}>
        <input value={value} onChange={onChange} />
      </form>
    </>
  );
};
```

<br>
<br>

##### useListen

<br>

- useSend gets the paramerter for the key of the MessageHandler, and returns
  only state for the key.

```tsx
const Component = (props: ComponentsProps) => {
  const [state] = useSend("talk");

  return(
    <div>
      {state.map(message)=> <span>{message}</span>}
    </div>
  )
};
```

## Contributors 👏🏻
<br/>

## LICENSE
<br/>
 MIT
