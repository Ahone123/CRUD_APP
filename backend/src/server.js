import userRoutes from "./routes/userRoutes.js";
import express from "express";
import cors from "cors";
import service from "./service.mjs";


const app = express();

app.use(cors());
app.use(express.json());

// User routes
app.use("/api/users", userRoutes);
console.log("USER ROUTES REGISTERED");

// Test route
app.get("/", (req, res) => {
  res.send("User Management API is running!");
});

const PORT = service.port();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
