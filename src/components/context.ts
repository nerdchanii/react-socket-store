import { createContext } from "react";
import type { ISocketStore } from "socket-store";

const ReactSocketContext = createContext<ISocketStore>({} as ISocketStore);

export default ReactSocketContext;
