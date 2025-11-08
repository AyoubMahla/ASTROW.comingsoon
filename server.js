import express from "express";
import dotenv from "dotenv";
import apiRouter from "./api/saveNumber.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
