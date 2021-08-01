"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const querystring = require('querystring');
const Websocket = __importStar(require("ws"));
const client_1 = require("./utils/client");
const editorGroup_1 = require("./utils/editorGroup");
const generateId_1 = __importDefault(require("./utils/generateId"));
const app = express_1.default();
app.use(cors_1.default());
app.get("/api/", (req, res) => {
    res.send("Our Editor Backend");
});
app.get("/api/generateEditorId", (req, res, next) => {
    setTimeout(() => {
        return res.status(200).json({
            boardId: generateId_1.default()
        });
    }, 3000);
});
app.get("/api/validEditor/:editorId", (req, res, next) => {
    return res.status(200).json({
        valid: editorGroup_1.validEditor(req.params.editorId)
    });
});
const server = app.listen(process.env.PORT, () => {
    console.log(`Listing on PORT: ${process.env.PORT}`);
});
const wss = new Websocket.Server({ server, path: "/webSocket" });
wss.on("connection", (ws) => {
    const clientId = generateId_1.default();
    client_1.createClient(clientId, ws);
    console.log(clientId, "connected");
    // Send Client Id
    ws.send(JSON.stringify({
        type: "clientId",
        message: "Connected",
        clientId,
        code: 200
    }));
    ws.on('joinEditor', (message) => {
        if (editorGroup_1.validEditor(message.editorId)) {
            editorGroup_1.addMemberToEditor(message.editorId, message.clientId);
        }
        else {
            editorGroup_1.createEditor(message.editorId, message.clientId);
        }
        ws.send(JSON.stringify({
            type: "joinEditor",
            message: "board joined/created",
            code: 200
        }));
    });
    ws.on('setName', (message) => {
        console.log("In");
        if (!message.clientId) {
            ws.send({
                message: "Client Id is required",
                code: 400
            });
        }
        else if (!message.name) {
            ws.send({
                message: "Name is required",
                code: 400
            });
        }
        else {
            if (client_1.setNameClient(message.clientId, message.name)) {
                ws.send({
                    code: 200
                });
            }
            else {
                ws.send({
                    message: "User Not found, Refresh the page",
                    code: 404
                });
            }
        }
    });
    ws.onclose = (event) => {
        console.log("Close", event);
    };
});
wss.close((e) => {
    console.log(e);
});
