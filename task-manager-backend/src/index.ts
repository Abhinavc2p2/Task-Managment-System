import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { authenticate } from "./middleware/auth.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";


const app = express();
console.log("ENV:", process.env.DATABASE_URL);
app.use(cors());
app.use(express.json());
console.log(process.env.DATABASE_URL);
// 👉 connect routes
app.use("/auth", authRoutes);


app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running ");
  console.log("ENV:", process.env.DATABASE_URL);
});



app.get("/protected", authenticate, (req: any, res) => {
  res.json({ message: "You are authorized", userId: req.userId });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});