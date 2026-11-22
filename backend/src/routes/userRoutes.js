
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// Prisma 8 surfaces unique-constraint failures as the Postgres SQLSTATE 23505
// (on the normalized error or its pg cause) instead of the old P2002 code.
function isUniqueViolation(error) {
  return error?.sqlState === "23505" || error?.cause?.code === "23505" || error?.code === "23505";
}

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.orm.public.User.orderBy((u) => u.id.desc()).all();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// CREATE a user
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const user = await prisma.orm.public.User.create({
      name: name.trim(),
      email: email.trim(),
      role: role?.trim() || "USER",
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Failed to create user" });
  }
});

// UPDATE a user
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, role } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const user = await prisma.orm.public.User.where({ id }).update({
      name: name.trim(),
      email: email.trim(),
      role: role?.trim() || "USER",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Failed to update user" });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.orm.public.User.where({ id }).delete();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
