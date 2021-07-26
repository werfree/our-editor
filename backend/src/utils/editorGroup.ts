const editor: Map<string, Array<string | null>> = new Map;

const createEditor = (editorId: string, clientId: string) => {
    editor.set(editorId, [clientId])
}
const addMemberToEditor = (editorId: string, clientId: string): boolean => {
    if (editor.has(editorId)) {
        const presentClientIds: Array<string | null> = editor.get(editorId) ?? [];
        presentClientIds?.push(clientId)
        editor.set(editorId, presentClientIds)
        return true
    }
    return false
}

const deleteEditor = (editorId: string) => {
    editor.delete(editorId);
}


editorId - [soumava, sayantan]