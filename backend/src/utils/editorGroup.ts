const Editor: Map<string, { code: string | null, clients: Array<string | null> }> = new Map;

const createEditor = (editorId: string, code: string, clientId: string) => {
    Editor.set(editorId, { code: null, clients: [clientId] })
}
const addMemberToEditor = (editorId: string, clientId: string): boolean => {

    if (Editor.has(editorId)) {
        const presentClientIds: Array<string | null> = Editor.get(editorId)?.clients ?? [];
        presentClientIds?.push(clientId)
        Editor.set(editorId, {
            code: Editor.get(editorId)?.code ?? null,
            clients: presentClientIds
        })
        return true
    }
    return false
}


const setEditorCode = (editorId: string, code: string): boolean => {

    if (Editor.has(editorId)) {
        const clients = Editor.get(editorId)?.clients ?? []
        Editor.set(editorId, {
            code,
            clients
        })
        return true
    }
    return false
}
const getEditorCode = (editorId: string): (string | null) => {
    return Editor.get(editorId)?.code ?? null
}

const validEditor = (editorId: string): boolean => {
    return Editor.has(editorId)
}

const deleteEditor = (editorId: string) => {
    Editor.delete(editorId);
}

export { validEditor, getEditorCode, setEditorCode, createEditor, addMemberToEditor }