import { Server } from "http"
import { WebSocketServer } from 'ws';
import express from 'express';
import user from "./controllers/user";
import UserSchema from "./schema/user";
import errorHandler from "./middlewares/error";

const app = express();
app.use(express.json());

const server = new Server(app);

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

// HTTP Routes
app.get("/", (_req, res) => {
  res.send("<h1>Hello world </h1>")
})

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

app.post("/users", (req, res) => {
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

app.listen(3001, () => console.log("server listening on port", 3001))
