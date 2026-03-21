// WebSocket chat handler — stub for real-time messaging
// In production, this would manage WebSocket connections for live message delivery

interface ConnectedClient {
  userId: string;
  matchId: string;
  ws: any;
}

const clients: ConnectedClient[] = [];

export function handleWebSocketUpgrade(ws: any, userId: string, matchId: string) {
  clients.push({ userId, matchId, ws });

  ws.addEventListener("close", () => {
    const index = clients.findIndex((c) => c.ws === ws);
    if (index !== -1) clients.splice(index, 1);
  });

  ws.addEventListener("message", (event: any) => {
    // Broadcast to other clients in the same match
    const message = event.data;
    clients
      .filter((c) => c.matchId === matchId && c.userId !== userId)
      .forEach((c) => {
        try {
          c.ws.send(message);
        } catch {
          // Client disconnected
        }
      });
  });
}
