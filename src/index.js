import express from "express";
import chalk from "chalk";
import signRoutes from "./routes/sign.routes.js";
import urlsRoutes from "./routes/urls.routes.js";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(signRoutes);
app.use(urlsRoutes);
app.use(userRoutes);


const port = process.env.PORT;
app.listen(port, () => {
    console.log(chalk.bold.green(`Server running in port: ${port}!`))
});