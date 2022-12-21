import db from "../database/database.js"
import { nanoid } from "nanoid";
import { urlShortenSchema } from "../models/urls.models.js";

export async function shortenUrl(req, res) {
    const { url } = req.body;
    const user = res.locals.user;

    console.log(user)
    const shortId = await nanoid();

    const { error } = urlShortenSchema.validate({ url }, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        await db.query(`INSERT INTO urls ("idUser", "nameUser", "shortUrl", url, "visitCount") VALUES ($1, $2, $3, $4, $5);`, [user.id, user.name, shortId, url, 0]);
        return res.status(201).send({ shortUrl: shortId })
    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
}

export async function getShortUrl(req, res) {
    const { id } = req.params;
    try {
        const short = await db.query(`SELECT * FROM urls WHERE id=$1;`, [id]);
        if (short.rows.length === 0) {
            return res.status(404).send("id de url inexistente!")
        }

        res.status(200).send({ id: short.rows[0].id, shortUrl: short.rows[0].short_url, url: short.rows[0].url })
    } catch (err) {
        return res.status(500).send(err.message)
    }

}

export async function openShortUrl(req, res) {
    const short = res.locals.short;
    const newVisitCount = short.visitCount + 1;
    console.log(newVisitCount);
    try {
        await db.query(`UPDATE urls SET "visitCount"=$1 WHERE "shortUrl"=$2;`, [newVisitCount, short.shortUrl]);
        return res.redirect(`${short.url}`)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function removeUrl(req, res) {
    const { id } = req.params;

    try {
        await db.query(`DELETE FROM urls WHERE id=$1;`, [id]);
        return res.status(204).send("URL deletada!");
    } catch (err) {
        return res.status(500).send(err.message);
    }
}