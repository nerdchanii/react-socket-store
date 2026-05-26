import { useCallback, useSyncExternalStore } from "react";
import { useSocketStore } from "../context";

export function useListen(key: string) {
  const store = useSocketStore();
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(key, onStoreChange),
    [store, key]
  );
  const getSnapshot = useCallback(() => store.getState(key), [store, key]);
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return [state];
}

export default useListen;
