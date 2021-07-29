import * as Socket from "ws"

let Client: Map<string, { name: string, socket: Socket | null }> = new Map()


const getClient = (clientId: string): { name: string | null, socket: Socket | null } => {
    return Client.get(clientId) || { name: null, socket: null }
}

const deleteClient = (clientId: string) => {
    Client.delete(clientId)
}

const createClient = (clientId: string, socket: (Socket)) => {
    Client.set(clientId, { name: "unknown", socket })
}

const setNameClient = (clientId: string, name: string): boolean => {
    if (Client.has(clientId)) {
        const socket = Client.get(clientId)?.socket ?? null;
        Client.set(clientId, { name, socket })
        return true
    }
    return false
}

export { getClient, createClient, deleteClient, setNameClient };
