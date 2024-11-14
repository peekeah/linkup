import { createServer } from "http";
import { WebSocketServer } from 'ws';
import express from 'express';

import requestHandler from "./routes/wsRoutes";
import { getEnv } from "./config";
import httpRoutes from "./routes/httpRoutes";

const app = express();
const server = createServer(app);

const port = getEnv("API_PORT", "5000")

app.use(express.json());

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws, req) {
  const header = req.headers["authorization"]?.split(" ");

  const token = header?.[1] || "";

  ws.on('error', console.error);
  ws.on('message', function message(data) {
    try {
      const message = JSON.parse(data.toString());
      console.log('message=>', message)
      requestHandler(ws, message, token)
    } catch (err) {
      console.log('err', err)
      ws.send("Invalid request")
    }
  });
});

app.use("/", httpRoutes)

server.listen(port, () => console.log("server listening on port", port))
