import react from "react";
import "./App.css";
import Demo from "./components/Demo";
import { SocketProvider } from "react-socket-store";
import Header from "./components/Demo/design/Header";
import store from "./sockets/index";

function App() {
  return (
    <SocketProvider store={store}>
      <div className="App border min-h-screen dark:bg-zinc-900">
        <Header />
        <Demo />
      </div>
    </SocketProvider>
  );
}

export default App;
