import { useCallback } from "react";
import { useSocketStore } from "../context";

export function useSend(key: string) {
  const store = useSocketStore();

  const send = useCallback(
    (message: string) => {
      store.send({ key, data: message });
    },
    [store, key]
  );

  return [send];
}
