import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { ADD_USER } from "./messages";

const wss = new WebSocketServer({port:8080});
const gameManager = new GameManager()

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === ADD_USER && message.payload?.username) {
        gameManager.addUser(ws, message.payload.username);
      }

    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});
