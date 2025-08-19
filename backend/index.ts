import express, { Request, Response } from "express";
import AuthRoute from "./route/AuthRoutes";
import AdminRoute from "./route/AdminRoutes";
import StudentRoute from "./route/StudentRoutes";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
const PORT = 8080;

dotenv.config();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

app.use("/auth", AuthRoute);
app.use("/admin", AdminRoute);
app.use("/students", StudentRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
