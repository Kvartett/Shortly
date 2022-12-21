import express from "express";
import chalk from "chalk";
import signRoutes from "./routes/sign.routes.js";
import urlsRoutes from "./routes/urls.routes.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
app.use(express.json());
app.use(signRoutes);
app.use(urlsRoutes);
app.use(userRoutes);

app.listen(4000, () => {
    console.log(chalk.bold.green("Server running in port: 4000!"))
});