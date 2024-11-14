import { createServer } from "http";
import { WebSocketServer } from 'ws';
import express from 'express';

import user from "./controllers/user";
import UserSchema, { LoginType } from "./schema/user";
import errorHandler from "./middlewares/error";
import requestHandler from "./controllers/requestHandler";

const app = express(); const server = createServer(app);

const port = 3001;

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

// HTTP Routes
app.get("/", (_req, res) => {
  res.send("<h1>Hello world </h1>")
})

app.post("/signup", (req, res) => {
  try {
    const userData = req.body;

    // User validation
    UserSchema.parse(userData)

    const newUser = user.create(userData)
    res.send({
      statue: true,
      data: newUser
    })

  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err)
    res.status(statusCode).send({
      status: false,
      message: errMessage
    })
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password }: LoginType = req.body;

    const token = await user.login(email, password)

    res.send({
      status: true,
      data: { token }
    })
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err)
    res.status(statusCode).send({
      status: false,
      message: errMessage
    })
  }
})

// Todo: Admin only route
app.get("/users", (_req, res) => {
  try {
    const users = user.getUsers()
    res.send({
      status: true,
      data: users
    })

  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err)
    res.status(statusCode).send({
      status: false,
      message: errMessage
    })

  }
})

server.listen(port, () => console.log("server listening on port", port))
