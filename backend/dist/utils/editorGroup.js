"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberToEditor = exports.createEditor = exports.setEditorCode = exports.getEditorCode = exports.validEditor = void 0;
const Editor = new Map;
const createEditor = (editorId, clientId) => {
    Editor.set(editorId, { code: null, clients: [clientId] });
};
exports.createEditor = createEditor;
const addMemberToEditor = (editorId, clientId) => {
    var _a, _b, _c, _d;
    if (Editor.has(editorId)) {
        const presentClientIds = (_b = (_a = Editor.get(editorId)) === null || _a === void 0 ? void 0 : _a.clients) !== null && _b !== void 0 ? _b : [];
        presentClientIds === null || presentClientIds === void 0 ? void 0 : presentClientIds.push(clientId);
        Editor.set(editorId, {
            code: (_d = (_c = Editor.get(editorId)) === null || _c === void 0 ? void 0 : _c.code) !== null && _d !== void 0 ? _d : null,
            clients: presentClientIds
        });
        return true;
    }
    return false;
};
exports.addMemberToEditor = addMemberToEditor;
const setEditorCode = (editorId, code) => {
    var _a, _b;
    if (Editor.has(editorId)) {
        const clients = (_b = (_a = Editor.get(editorId)) === null || _a === void 0 ? void 0 : _a.clients) !== null && _b !== void 0 ? _b : [];
        Editor.set(editorId, {
            code,
            clients
        });
        return true;
    }
    return false;
};
exports.setEditorCode = setEditorCode;
const getEditorCode = (editorId) => {
    var _a, _b;
    return (_b = (_a = Editor.get(editorId)) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : null;
};
exports.getEditorCode = getEditorCode;
const validEditor = (editorId) => {
    return Editor.has(editorId);
};
exports.validEditor = validEditor;
const deleteEditor = (editorId) => {
    Editor.delete(editorId);
};
