import { useCallback } from "react";
import { useSocketStore } from "../context";
import { useListen } from "./useListen";

type Return = [any, (message: any) => void];

export function useSocket(key: string): Return {
  const store = useSocketStore();
  const [state] = useListen(key);

  const send = useCallback(
    (message: any) => {
      store.send({ key, data: message });
    },
    [store, key]
  );

  return [state, send];
}
