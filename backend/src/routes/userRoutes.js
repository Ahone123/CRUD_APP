
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });

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

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        role: role?.trim() || "USER",
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
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

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
        role: role?.trim() || "USER",
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    if (error.code === "P2002") {
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

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
