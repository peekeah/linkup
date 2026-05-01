import { Router } from "express";
import user from "../controllers/user";
import errorHandler from "../middlewares/error";
import { prisma } from "../utils/db";
import { requireRole, validateRole } from "../middlewares/httpMiddleware";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { getEnv } from "../config";

const router = Router();

// HTTP Routes
router.get("/", (_req, res) => {
  res.send("<h1>Hello world </h1>");
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Google OAuth Callback
router.post("/auth/google/callback", async (req, res) => {
  try {
    const OAuthCallbackSchema = z.object({
      email: z.string().email(),
      name: z.string(),
      image: z.string().optional(),
      googleId: z.string(),
    });

    const { email, name, image, googleId } = OAuthCallbackSchema.parse(req.body);

    // Check if user exists, if not create new user
    let existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      // Create new user from OAuth data
      existingUser = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0], // Use name or fallback to email prefix
          mobile: null, // Empty for OAuth users
          bio: null, // Empty bio for OAuth users
          image: image || null, // Store Google profile image
          googleId: googleId, // Mandatory Google ID for OAuth users
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      getEnv("JWT_SECRET", "fallback-secret"),
      { expiresIn: "7d" },
    );

    res.send({
      status: true,
      data: {
        userId: existingUser.id,
        email: existingUser.email,
        userName: existingUser.name || existingUser.email.split("@")[0], // Use name as username or fallback
        name: existingUser.name,
        mobile: existingUser.mobile,
        bio: existingUser.bio,
        image: existingUser.image, // Include profile image
        token,
      },
    });
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err);
    res.status(statusCode).send({
      status: false,
      message: errMessage,
    });
  }
});

router.get("/users", requireRole("ADMIN"), async (_req, res) => {
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

// Get User Profile
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = await validateRole(req, "USER");

    if (id !== req.params.id) {
      return res.status(403).send({ status: false, message: "Forbidden" });
    }

    const userProfile = await user.getUser(id);

    res.send({
      status: true,
      data: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        mobile: userProfile.mobile,
        bio: userProfile.bio,
        image: userProfile.image,
      },
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
  try {
    const { id } = await validateRole(req, "USER");

    if (id !== req.params.id) {
      return res.status(403).send({ status: false, message: "Forbidden" });
    }

    const { name, mobile, bio } = req.body;

    const data = await user.update(id, { name, mobile, bio });

    res.send({
      status: true,
      data,
    });
  } catch (err) {
    const { statusCode, errMessage } = errorHandler(err);
    res.status(statusCode).send({
      status: false,
      message: errMessage,
    });
  }
});

export default router;
