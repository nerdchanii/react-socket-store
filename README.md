# React-socket

It is for easily using Websocket in React.It inspired by React-redux.

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

- [createMessageHandler](####2-1-createMessageHandler')
- [createSocketStore](<####2-2-createSocketStore(socket:-Websocket,-messageHandlers)>)

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

#### 2-2 create SocketStore(socket: Websocket, messageHandlers)

<br>

Next, create a socket store.<br>
Store gets two parameters for web sockets and message handlers.

```ts
//handlers = you can uses like this.
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

#### 3. Use SocketStore

<br>

we supply API for using SocketStore, by hooks.

- [useSocket](#####useSocket)
- [useSend](#####useSend)
- [useListen](#####useListen)
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
