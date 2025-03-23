import cors from "cors";
import express from "express";
import * as Websocket from "ws";
import { createClient, deleteClient, setNameClient } from "./utils/client";
import {
  addMemberToEditor,
  createEditor,
  validEditor,
} from "./utils/editorGroup";
import generateId from "./utils/generateId";
import { clientJoinedOnEditor, onEditorChange } from "./utils/onEditorChange";
import codeRouter from "./routers/code";

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.get("/api/", (req: express.Request, res: express.Response) => {
  res.send("Code Link Backend");
});

app.get(
  "/api/generateEditorId",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(200).json({
      boardId: generateId(),
    });
  }
);

app.get(
  "/api/validEditor/:editorId",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(200).json({
      valid: validEditor(req.params.editorId),
    });
  }
);

app.post(
  "/api/editor/join",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {
      editorId,
      clientId,
      clientName,
    }: { editorId: string; clientId: string; clientName: string } = req.body;
    if (!editorId || !clientId || !clientName) {
      return res.status(400).json({
        message: "EditorId and clientId is required",
      });
    }
    if (validEditor(editorId)) {
      addMemberToEditor(editorId, clientId);
      setNameClient(clientId, clientName);
      clientJoinedOnEditor(clientId, editorId);
    } else {
      createEditor(editorId, clientId);
    }
    setNameClient(clientId, clientName);
    return res.status(200).json({
      message: "Created/JoinEditor",
    });
  }
);

app.use("/api/code", codeRouter);

const server = app.listen(process.env.PORT, () => {
  console.log(`Listing on PORT: ${process.env.PORT}`);
});

const wss = new Websocket.Server({ server, path: "/webSocket" });

interface myWSS extends Websocket {
  clientId: string;
}

wss.on("listening", () => {
  console.log(
    "✅ WebSocket server is running and ready to accept connections!"
  );
});

wss.on("connection", (ws: myWSS) => {
  const clientId = generateId();
  createClient(clientId, ws);
  console.log(clientId, "connected");
  ws.clientId = clientId;
  // Send Client Id
  ws.send(
    JSON.stringify({
      type: "clientId",
      message: "Connected",
      clientId,
      code: 200,
    })
  );
  ws.onmessage = (message: any) => {
    const parseMessage = JSON.parse(message.data);

    if (parseMessage.type === "editorChange") {
      onEditorChange(parseMessage);
    }
  };

  ws.onclose = (event: Websocket.CloseEvent) => {
    console.log("Close", ws.clientId);
    deleteClient(ws.clientId);
  };
});
