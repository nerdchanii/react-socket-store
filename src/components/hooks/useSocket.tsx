//custom hook
import { useEffect, useContext, useState, useCallback } from "react";
import ReactSocketContext from "../context";

type Return = [any, (message: any) => void];

export function useSocket(key: string): Return {
  const store = useContext(ReactSocketContext);
  const [state, setState] = useState(store.getState(key));

  const send = useCallback((message: any) => {
    store.send({ key, data: message });
  }, []);

  useEffect(() => {
    store.subscribe(key, setState);
  }, [store, key]);

  return [state, send];
}
