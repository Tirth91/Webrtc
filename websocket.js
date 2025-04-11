const WEBSOCKET_URL = "wss://cce6805d-8140-4652-a9db-4480e722631a-00-1s8e6nwe8s468.sisko.replit.dev/";

let ws;

export function initWebSocket(onMessage) {
  ws = new WebSocket(WEBSOCKET_URL);

  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.warn("WebSocket disconnected");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

export function sendPrediction(username, prediction) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "gesture", username, prediction }));
  }
}
