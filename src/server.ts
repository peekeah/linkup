import { Server } from "http"
import { WebSocketServer } from 'ws';
import express from 'express';

const app = express();

const server = new Server(app)

const wss = new WebSocketServer({
  server
});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

app.get("/", (_req, res) => {
  res.send("<h1>Hello world </h1>")
})

app.listen(3001, () => console.log("server listening on port", 3001))
