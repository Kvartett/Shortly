import express from "express";
import chalk from "chalk";
import signRoutes from "./routes/sign.routes.js";

const app = express();
app.use(express.json);
app.use(signRoutes);


app.listen(4000, () => {
    console.log(chalk.bold.green("Server running in port: 4000!"))
});