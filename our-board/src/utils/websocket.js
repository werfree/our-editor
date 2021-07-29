const createWebSocket = ()=>{
    console.log(process.env.REACT_APP_WS_URL)
    return new WebSocket("ws://localhost:8080/webSocket")
}

export {createWebSocket}