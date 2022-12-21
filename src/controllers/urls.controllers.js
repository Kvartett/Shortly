import db from "../database/database.js"
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
    const { url } = req.body;
    const user = res.locals.user;

    const shortId = await nanoid();

    try {
        await db.query(`INSERT INTO urls (id_user, name_user, short_url, url, visitcount) VALUES ($1, $2, $3, $4, $5);`, [user.id, user.name, shortId, url, 0]);
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
    const newVisitCount = short.visitcount + 1;
    try {
        await db.query(`UPDATE urls SET visitcount=$1;`, [newVisitCount]);
        return res.redirect(`${short.url}`)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function removeUrl(req, res) {

}