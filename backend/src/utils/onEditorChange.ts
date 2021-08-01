import WebSocket from "ws"
import { getClient } from "./client"
import { getClientIdsForEditor, setEditorCode } from "./editorGroup"

const onEditorChange = (message: { clientId: string, editorId: string, code: string, language: string }) => {
    setEditorCode(message.editorId, message.code, message.language)
    const clientIds: Array<string | null> = getClientIdsForEditor(message.editorId)
    for (const clientId of clientIds) {
        if (clientId && clientId !== message.clientId) {
            const { socket }: { socket: WebSocket | null } = getClient(clientId)

            socket?.send(JSON.stringify({
                type: "changeEditor",
                message: { language: message.language, code: message.code },
                code: 200
            }))
        }

    }
}

export { onEditorChange }