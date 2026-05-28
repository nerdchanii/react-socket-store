import { useCallback } from "react";
import type {
  DefaultSchema,
  SocketSchema,
  SocketStoreLike,
  TopicKey,
  TopicPayload,
} from "../../types";
import { useProvidedOrContextStore } from "../context";

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
>(key: K): UseSendResult<Schema, K>;
export function useSend<
  Schema extends SocketSchema,
  K extends TopicKey<Schema>
>(store: SocketStoreLike<Schema>, key: K): UseSendResult<Schema, K>;

export function useSend<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(
  storeOrKey: SocketStoreLike<Schema> | K,
  maybeKey?: K
): UseSendResult<Schema, K> {
  const hasExplicitStore = maybeKey !== undefined;
  const store = hasExplicitStore
    ? (storeOrKey as SocketStoreLike<Schema>)
    : undefined;
  const key = hasExplicitStore ? maybeKey : (storeOrKey as K);

  const resolvedStore = useProvidedOrContextStore<Schema>(store);

  const send = useCallback(
    (message: TopicPayload<Schema, K>) => {
      resolvedStore.send({ key, data: message });
    },
    [resolvedStore, key]
  );

  return [send];
}
