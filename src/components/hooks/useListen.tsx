import { useCallback, useSyncExternalStore } from "react";
import type {
  DefaultSchema,
  SocketSchema,
  TopicKey,
  TopicState,
} from "../../types";
import { useSocketStore } from "../context";

export type UseListenResult<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = [TopicState<Schema, K>];

export function useListen<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): UseListenResult<Schema, K> {
  const store = useSocketStore<Schema>();
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubscribe = store.subscribe(key, onStoreChange);

      return typeof unsubscribe === "function" ? unsubscribe : () => undefined;
    },
    [store, key]
  );
  const getSnapshot = useCallback(() => store.getState(key), [store, key]);
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return [state];
}

export default useListen;
