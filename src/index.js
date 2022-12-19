import express from "express";

const app = express();
app.use(express.json);


app.listen(4000, () => {
    console.log(chalk.bold.green("Server running in port: 4000!"))
})