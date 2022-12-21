import { loginSchema, userSchema } from "../models/user.models.js";
import db from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    const { error } = userSchema.validate({ email, password, name, confirmPassword }, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if (password !== confirmPassword) {
        return res.status(422).send("Confirmação de senha incorreta!");
    }

    try {
        const userExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email.toLowerCase()]);

        if (userExist.rows.length > 0) {
            return res.status(409).send("E-mail ja cadastrado!");
        }

        const passwordHash = bcrypt.hashSync(password, 12);
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email.toLowerCase(), passwordHash]);
        res.status(201).send("Usuario cadastrado!");
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    const { error } = loginSchema.validate({ email, password }, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const userExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email.toLowerCase()]);

        if (userExist.rows.length === 0) {
            return res.status(401).send("Usuario não existe!");
        }

        if (bcrypt.compareSync(password, userExist.rows[0].password)) {
            const token = uuid();

            await db.query(`INSERT INTO sessions (token, email) VALUES ($1, $2);`, [token, email.toLowerCase()]);
            res.status(200).send({ token });
        } else {
            res.status(401).send("Usuario não encontrado! E-mail ou senha incorretos.");
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
}