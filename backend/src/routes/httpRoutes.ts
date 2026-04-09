import { Router } from "express";
import UserSchema, { LoginType } from "../schema/user";
import user from "../controllers/user";
import errorHandler from "../middlewares/error";
import { prisma } from "../utils/db";
import { generateHash } from "../utils/bcrypt";
import { requireRole } from "../middlewares/httpMiddleware";

const router = Router();

// HTTP Routes
router.get("/", (_req, res) => {
  res.send("<h1>Hello world </h1>");
});

router.post("/signup", async (req, res) => {
  try {
    const userData = req.body;

    // User validation
    UserSchema.parse(userData);
    const hashedPassword = await generateHash(userData.password);

    const { password: _, ...newUser } = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    res.send({
      status: true,
      data: newUser,
    });
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err);
    res.status(statusCode).send({
      status: false,
      message: errMessage,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password }: LoginType = req.body;

    const userData = await user.login(email, password);

    res.send({
      status: true,
      data: userData,
    });
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err);
    res.status(statusCode).send({
      status: false,
      message: errMessage,
    });
  }
});

router.get("/users", requireRole("ADMIN"), async (req, res) => {
  try {
    const users = await user.getUsers();
    res.send({
      status: true,
      data: users,
    });
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err);
    res.status(statusCode).send({
      status: false,
      message: errMessage,
    });
  }
});

// Update User
router.post("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { name, email, mobile, address } = req.body;
    const newUserData = {
      id,
      name,
      email,
      mobile,
      address,
    };

    await user.update(newUserData);

    res.send({
      status: true,
      data: newUserData,
    });
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err);
    res.status(statusCode).send({
      status: false,
      messge: errMessage,
    });
  }
});

export default router;
