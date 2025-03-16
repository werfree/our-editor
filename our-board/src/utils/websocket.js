import { API_URL, WS_URL } from "./apiUrl";
console.log(WS_URL, API_URL, "WS URL");
const createWebSocket = () => {
  return new WebSocket("ws://localhost:3001/webSocket");
};

export { createWebSocket };
