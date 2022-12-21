import db from "../database/database.js";

export async function userInfo(req, res) {
    const user = res.locals.user;

    try {
        const queryUser = await db.query(`SELECT users.id, users.name, SUM(urls.visit_count) AS "visitCount" FROM users JOIN urls ON users.id = urls.id_user WHERE id_user=$1 GROUP BY users.id;`, [user.id]);
        const queryShortenedUrls = await db.query(`SELECT urls.id, urls.short_url, urls.url, urls.visit_count FROM urls WHERE id_user=$1;`, [user.id]);
        return res.status(200).send({
            ...queryUser.rows[0],
            shortenedUrls: queryShortenedUrls.rows
        });
    } catch (err) {
        return res.status(500).send(err.message);
    }
}