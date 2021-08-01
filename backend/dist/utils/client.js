"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNameClient = exports.deleteClient = exports.createClient = exports.getClient = void 0;
let Client = new Map();
const getClient = (clientId) => {
    return Client.get(clientId) || { name: null, socket: null };
};
exports.getClient = getClient;
const deleteClient = (clientId) => {
    Client.delete(clientId);
};
exports.deleteClient = deleteClient;
const createClient = (clientId, socket) => {
    Client.set(clientId, { name: "unknown", socket });
};
exports.createClient = createClient;
const setNameClient = (clientId, name) => {
    var _a, _b;
    if (Client.has(clientId)) {
        const socket = (_b = (_a = Client.get(clientId)) === null || _a === void 0 ? void 0 : _a.socket) !== null && _b !== void 0 ? _b : null;
        Client.set(clientId, { name, socket });
        return true;
    }
    return false;
};
exports.setNameClient = setNameClient;
