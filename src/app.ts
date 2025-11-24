import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/globalErrorhandler";
import globalRoutes from "./routers/routes";

const app = express();


app.use(express.json());

app.use(cookieParser());

app.use('/api', globalRoutes);

app.use(errorHandler);

export default app;
