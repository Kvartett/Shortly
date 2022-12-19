import { userSchema } from "../models/user.model.js";
import db from "../database/database.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    const { error } = userSchema.validate({ email, password, name }, { abortEarly: false });

    if (error) {
        console.log("Entrou no validation JOI")
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if (password !== confirmPassword) {
        console.log("Entrou password invalido")
        return res.status(422).send("Confirmação de senha incorreta!");
    }

    try {
        console.log("To no try")
        const userExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);

        if (userExist.rows.length > 0) {
            console.log("To no user exist!")
            return res.status(409).send("E-mail ja cadastrado!");
        }

        const passwordHash = bcrypt.hashSync(password, 12);
        console.log("To quase no fim")
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, passwordHash]);
        res.status(201).send("Usuario cadastrado!");
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function signIn(req, res) {
    
}