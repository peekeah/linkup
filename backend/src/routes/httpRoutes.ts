import { Router } from "express";
import UserSchema, { LoginType } from "../schema/user";
import user from "../controllers/user";
import errorHandler from "../middlewares/error";

const router = Router();

// HTTP Routes
router.get("/", (_req, res) => {
  res.send("<h1>Hello world </h1>")
})

router.post("/signup", (req, res) => {
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

router.post("/login", async (req, res) => {
  try {
    const { email, password }: LoginType = req.body;

    const userData = await user.login(email, password)

    res.send({
      status: true,
      data: userData
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
router.get("/users", (_req, res) => {
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

// Update User
router.post("/users/:id", (req, res) => {
  try {
    const { id, name, email, mobile, address } = req.body;
    const newUserData = {
      id,
      name,
      email,
      mobile,
      address,
    }

    user.update(newUserData)

    res.send({
      status: true,
      data: newUserData
    })

  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err)
    res.status(statusCode).send({
      status: false,
      messge: errMessage
    })
  }
})


export default router;
