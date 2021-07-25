import cors from "cors"
import express from "express";
import * as Websocket from "ws"

const app: express.Application = express();
app.use(cors())
app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Our Editor Backend")
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listing on PORT: ${process.env.PORT}`)
});

const io = new Websocket.Server({ server });

io.on("connection", (socket: Websocket) => {
    console.log(socket)
    socket.send("Hello")
})



