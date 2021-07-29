import cors from "cors"
import express from "express";
const querystring = require('querystring');
import * as Websocket from "ws";
import { createClient, setNameClient } from "./utils/client";
import { validEditor } from "./utils/editorGroup";
import generateId from "./utils/generateId";

const app: express.Application = express();
app.use(cors())
app.get("/api/", (req: express.Request, res: express.Response) => {
    res.send("Our Editor Backend")
})

app.get("/api/generateEditorId", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    setTimeout(() => {
        return res.status(200).json({
            boardId: generateId()
        })
    }, 3000)

})

app.get("/api/validEditor/:editorId", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(200).json({
        valid: validEditor(req.params.editorId)
    })
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listing on PORT: ${process.env.PORT}`)
});

const wss = new Websocket.Server({ server, path: "/webSocket" });

wss.on("connection", (ws: Websocket) => {
    const clientId = generateId();
    createClient(clientId, ws)
    console.log(clientId, "connected")
    ws.send(JSON.stringify({
        type: "clientId",
        message: "Connected",
        clientId,
        code: 200
    }))
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: "clientId",
            message: "Connected",
            clientId,
            code: 200
        }))
    }, 3000)
    ws.on('setName', (message: { clientId: string, name: string }) => {
        console.log("In")
        if (!message.clientId) {
            ws.send({
                message: "Client Id is required",
                code: 400
            })
        } else if (!message.name) {
            ws.send({
                message: "Name is required",
                code: 400
            })
        } else {
            if (setNameClient(message.clientId, message.name)) {
                ws.send({
                    code: 200
                })
            } else {
                ws.send({
                    message: "User Not found, Refresh the page",
                    code: 404
                })
            }

        }

    })

})



