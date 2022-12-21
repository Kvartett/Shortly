import db from "../database/database.js";

export async function userInfo(req, res) {
    const user = res.locals.user;

    try {
        const queryUser = await db.query(`SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount" FROM users JOIN urls ON users.id = urls."idUser" WHERE "idUser"=$1 GROUP BY users.id;`, [user.id]);
        const queryShortenedUrls = await db.query(`SELECT urls.id, urls."shortUrl", urls.url, urls."visitCount" FROM urls WHERE "idUser"=$1;`, [user.id]);
        return res.status(200).send({
            ...queryUser.rows[0],
            shortenedUrls: queryShortenedUrls.rows
        });
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getRanking(req, res) {
    try {
        const queryRanking = await db.query(`SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", COALESCE(SUM(urls."visitCount"), 0) AS "visitCount" FROM users LEFT JOIN urls ON users.id = urls."idUser" GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;`);
        return res.status(200).send(queryRanking.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}