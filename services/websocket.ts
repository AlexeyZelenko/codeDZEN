import { ref, onMounted, onBeforeUnmount } from "vue";

const activeSessions = ref(0);
let socket = null;
let heartbeatInterval = null;
let reconnectAttempts = 0;

export function useWebSocket() {
  const maxReconnectAttempts = 1;
  const baseReconnectDelay = 5000;
  const maxReconnectDelay = 30000;

  const connect = () => {
    if (socket || reconnectAttempts >= maxReconnectAttempts) return;

    const wsUrl =
      import.meta.env.VITE_WEBSOCKET_URL ||
      "wss://codedzen-service-639285203380.us-central1.run.app/ws";
    socket = new WebSocket(wsUrl);

    socket.addEventListener("open", () => {
      reconnectAttempts = 0;
      sendHeartbeat();
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "sessions") {
          activeSessions.value = data.count;
        }
      } catch (error) {
        console.error(
          "[WebSocket] Failed to parse message:",
          event.data,
          error,
        );
      }
    });

    socket.addEventListener("close", (event) => {
      socket = null;

      if (event.code !== 1000) {
        scheduleReconnect();
      }
    });

    socket.addEventListener("error", (error) => {
      console.error("[WebSocket] Connection error:", error);
      socket?.close();
    });
  };

  const scheduleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.warn("[WebSocket] Maximum reconnect attempts reached.");
      return;
    }
    reconnectAttempts += 1;
    const reconnectDelay = Math.min(
      baseReconnectDelay * reconnectAttempts,
      maxReconnectDelay,
    );
    setTimeout(connect, reconnectDelay);
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  const sendHeartbeat = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "heartbeat" }));
    }
  };

  onMounted(() => {
    connect();
    heartbeatInterval = setInterval(sendHeartbeat, 30000);
  });

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    activeSessions,
    connect,
    disconnect,
  };
}
