import db from "../database/database.js";

export async function validateTokenUser(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.sendStatus(401);
    }

    const userSession = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
    if (userSession.rows.length === 0) {
        return res.sendStatus(404);
    }
    
    const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [userSession.rows[0].email]);

    res.locals.user = user.rows[0];
    next();
}