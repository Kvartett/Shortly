import db from "../database/database.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.sendStatus(401);
    }

    const userSession = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
    if (userSession.rows.length === 0) {
        return res.sendStatus(401);
    }

    const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [userSession.rows[0].email]);

    res.locals.user = user.rows[0];
    next();
}

export async function shortUrlExist(req, res, next) {
    const { shortUrl } = req.params;

    const shortExist = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortUrl]);

    if (shortExist.rows.length === 0) {
        return res.status(404).send("Short URL não existe!");
    }

    res.locals.short = shortExist.rows[0];
    next();
}

export async function canDeleteUrl(req, res, next) {
    const { id } = req.params;
    const user = res.locals.user;

    const urlExist = await db.query(`SELECT * FROM urls WHERE id=$1;`, [id]);

    if (urlExist.rows.length === 0) {
        return res.status(404).send("Short URL não existe!");
    }

    if (urlExist.rows[0].idUser !== user.id) {
        return res.status(401).send("Essa URL não é sua para deletar!");
    }

    next();
}