import { useContext, useEffect, useState } from "react";
import ReactSocketContext from "../context";

export function useListen(key: string) {
  const store = useContext(ReactSocketContext);
  const [state, setState] = useState(store.getState(key));

  useEffect(() => {
    store.subscribe(key, setState);
  }, [store, key]);

  return [state];
}

export default useListen;
