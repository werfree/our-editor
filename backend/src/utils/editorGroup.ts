const Editor: Map<string, { language: string | null, code: string | null, clients: Array<string | null> }> = new Map;

const createEditor = (editorId: string, clientId: string) => {
    Editor.set(editorId, { language: null, code: null, clients: [clientId] })
}
const addMemberToEditor = (editorId: string, clientId: string): boolean => {

    if (Editor.has(editorId)) {
        const presentClientIds: Array<string | null> = Editor.get(editorId)?.clients ?? [];
        presentClientIds?.push(clientId)
        Editor.set(editorId, {
            language: Editor.get(editorId)?.language ?? null,
            code: Editor.get(editorId)?.code ?? null,
            clients: presentClientIds
        })
        return true
    }
    return false
}

const getClientIdsForEditor = (editorId: string): Array<string | null> => {
    return Editor.get(editorId)?.clients ?? []
}


const setEditorCode = (editorId: string, code: string, language: string): boolean => {

    if (Editor.has(editorId)) {
        const clients = Editor.get(editorId)?.clients ?? []
        Editor.set(editorId, {
            language,
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
const getEditorLanguage = (editorId: string): (string | null) => {
    return Editor.get(editorId)?.language ?? null
}

const validEditor = (editorId: string): boolean => {
    return Editor.has(editorId)
}

const deleteEditor = (editorId: string) => {
    Editor.delete(editorId);
}

export { validEditor, getEditorCode, setEditorCode, createEditor, addMemberToEditor, getEditorLanguage, getClientIdsForEditor }