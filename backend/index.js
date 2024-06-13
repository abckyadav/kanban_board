import express from "express";
import cors from "cors";
import ConnectMongoDB from "./src/config/db.js";
import dotenv from "dotenv";
import UserRoutes from "./src/routes/route.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/api/", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  ConnectMongoDB();
});