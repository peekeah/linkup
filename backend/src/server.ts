import { createServer } from "http";
import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';

import requestHandler from "./routes/wsRoutes";
import { getEnv } from "./config";
import httpRoutes from "./routes/httpRoutes";
import { TokenData, verifyToken } from "./utils/jwt";
import { activeClients } from "./store/clients";
import cors from "cors";

export interface CustomWebsocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

const app = express();
const server = createServer(app);

const port = getEnv("API_PORT", "5000")

app.use(express.json());
app.use(cors());

export const wss = new WebSocketServer({ server });

function heartbeat(this: CustomWebsocket) {
  this.isAlive = true;
}

wss.on('connection', function connection(ws: CustomWebsocket, req) {
  ws.isAlive = true;

  const header = req.headers["authorization"]?.split(" ");
  const token = header?.[1] || "";

  let tokenData: TokenData;

  // Verify token
  try {
    tokenData = verifyToken(token);
    ws.userId = tokenData.userId;

    // Add connection to map;
    activeClients.set(tokenData.userId, ws)
  } catch (err) {
    console.error("Token verification failed:", err);
    ws.terminate();
    return;
  }

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    try {
      const message = JSON.parse(data.toString());
      console.log('message=>', message)
      requestHandler(ws, message, tokenData)
    } catch (err) {
      console.log('err', err)
      ws.send("Invalid request")
    }
  });

  ws.on("pong", heartbeat)
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws: CustomWebsocket) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping()
  })
}, 30 * 1000)

wss.on("close", () => {
  clearInterval(interval)
})

app.use("/", httpRoutes)

server.listen(port, () => console.log("server listening on port", port))
