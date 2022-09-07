# react-socket-store

It is for easily using Websocket in React. It inspired by [React-redux](https://github.com/reduxjs/react-redux).<br>
It is provider of [socket-store](https://github.com/nerdchanii/socket-store).

## Quick Start


### 1. Install


```bash
#npm

npm install react-socket-store

#yarn

yarn add react-socket-store
```



### 2. Create MessageHandler(s), and Socket Store


MesssageHandler and Socket store is based on [socket-store](https://github.com/nerdchanii/socket-store).

- [createMessageHandler](#2-1-create-messagehandler)
- [createSocketStore](#2-2-create-socketstore)

#### 2-1. Create MessageHandler


First, create a message handler.<br>
Define the topic, callback for the topic, and default status. This will be provided in the store.

- createMessageHandler(key, callback, state)
  - `key` : it will be subject of message.
  - `callback`: it will works like reducer. it **_must return state!_**
  - `state`: it is defualt state.

```ts
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

- createSocketStore(ws: WebSocket, messageHandlers: MessageHandler[], options?: SocketStoreOptions)

```ts
const socketStore = createSocketStore(
  new WebSocket("ws://localhost:3000"),
  [talkHandler],
  {
    onOpen: () => console.log("open"),
    onClose: () => console.log("close"),
    onError: () => console.log("error"),
  }
);
```


#### 2-3. Provider


- Wrap your `<App>` with `<SocketProvider>`, and provide a previously created store as a prop for the socket provider.

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



### 3. Use SocketStore with Hook


we supply API for using SocketStore, by hooks.

- [useSocket](#3-1-usesocket)
- [useSend](#3-2-usesend)
- [useListen](#3-3-uselisten)



#### 3-1. useSocket

`useSocket` gets the parameter for the key of the MessageHandler, and returns the state, and sendfunction for the key.

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


#### 3-2. useSend

`useSend` gets the paramerter for the key of the MessageHandler, and returns
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


#### 3-3. useListen

`useSend` gets the paramerter for the key of the MessageHandler, and returns
  only state for the key.

```tsx
const Component = (props: ComponentsProps) => {
  const [state] = useSend("talk");

  return(
    <div>
      {state.map((message)=> <span>{message}</span>)}
    </div>
  )
};
```



## Contributors 👏🏻
<br/>

## LICENSE
<br/>
 MIT
