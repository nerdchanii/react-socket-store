import { createContext } from "react";
import { ISocketStore } from "socket-store/dist/esm/types";

const ReactSocketContext = createContext<ISocketStore>({} as ISocketStore);

export default ReactSocketContext;
