let Client: Map<string, string> = new Map()


const getClient = (clientId: string) => {
    Client.get(clientId)
}

const delClient = (clientId: string) => {
    Client.delete(clientId)
}

const setClient = (clidId: string, req: string) => {
    Client.set(clidId, req)
}

export { getClient, setClient, delClient };
