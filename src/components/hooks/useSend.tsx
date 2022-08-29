import { useContext } from "react";
import ReactSocketContext from "../context";

export function useSend(key: string) {
  const store = useContext(ReactSocketContext);

  return [
    (message: string) => {
      store.send({ key, data: message });
    },
  ];
}
