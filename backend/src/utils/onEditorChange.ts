import WebSocket from "ws";
import { getClient } from "./client";
import { getClientIdsForEditor, setEditorCode } from "./editorGroup";

const onEditorChange = (message: {
  clientId: string;
  editorId: string;
  code: string;
  language: string;
  name: string;
  codeChange: Uint8Array;
}) => {
  setEditorCode(message.editorId, message.code, message.language);
  const clientIds: Array<string | null> = getClientIdsForEditor(
    message.editorId
  );
  for (const clientId of clientIds) {
    if (clientId && clientId !== message.clientId) {
      const { socket }: { socket: WebSocket | null } = getClient(clientId);

      socket?.send(
        JSON.stringify({
          type: "changeEditor",
          message: {
            language: message.language,
            code: message.code,
            name: message.name,
            codeChange: message.codeChange,
          },
          code: 200,
        })
      );
    }
  }
};

const clientJoinedOnEditor = (newClientId: string, editorId: string) => {
  const clientIdsForEditor = getClientIdsForEditor(editorId);
  const client = getClient(newClientId);
  if (editorId) {
    for (const clientId of clientIdsForEditor) {
      if (clientId && clientId !== newClientId) {
        const { socket }: { socket: WebSocket | null } = getClient(clientId);

        if (socket)
          socket.send(
            JSON.stringify({
              type: "join",
              clientName: client.name,
              code: 200,
            })
          );
        else {
          console.log("Socket Null", clientId);
        }
      }
    }
  }
};
export { onEditorChange, clientJoinedOnEditor };
