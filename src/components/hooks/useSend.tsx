import { useCallback } from "react";
import type {
  DefaultSchema,
  SocketSchema,
  TopicKey,
  TopicPayload,
} from "../../types";
import { useSocketStore } from "../context";

export type SendForTopic<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = (message: TopicPayload<Schema, K>) => void;

export type UseSendResult<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
> = [SendForTopic<Schema, K>];

export function useSend<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): UseSendResult<Schema, K> {
  const store = useSocketStore<Schema>();

  const send = useCallback(
    (message: TopicPayload<Schema, K>) => {
      store.send({ key, data: message });
    },
    [store, key]
  );

  return [send];
}
