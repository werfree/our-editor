const createWebSocket = ()=>{
    return new WebSocket("ws://localhost:8080/webSocket")
}

export {createWebSocket}