const DB = require("../db/db");
const Leaderboard = require("../db/module");


const postUser  = async (ip, name, diff, mistake, time) => {
    const now = new Date().toISOString();
    const user = new Leaderboard({
        date: now,
        ip: ip,
        name: name,
        diff: diff,
        mistake: mistake,
        time: time
    });
    const result = await DB.query(
                    `INSERT INTO public.soduku_lb(date, ip, name, diff, mistake, time) 
                     VALUES ($1, $2, $3, $4, $5, $6);`,
                     [user.date, user.ip, user.name, user.diff, user.mistake, user.time]); 

    return {count: result.rowCount, user: user};
};


const getUsers = async () => {
    const users = await DB.query(
                    `SELECT * 
                     FROM soduku_lb;`);
    return users.rows;
}

const boardByDiff = async (diff) => {
    const user = await DB.query(
        `SELECT *
        FROM soduku_lb
        WHERE diff = $1
        ORDER BY mistake ASC, time ASC;`, [diff]);

    return user.rows
}

const countUsers = async () => {
    const numOfUsers = await DB.query(`SELECT 
                                        COUNT(*) 
                                        FROM soduku_lb`);
    
    return numOfUsers.rows[0].count;
}

const deleteUser = async (oprator) => {
    const deleteUsers = await DB.query(`DELETE 
                                        FROM public.soduku_lb
                                        WHERE id = $1;`, [oprator]);
    console.log(deleteUsers);
    return deleteUsers.rowCount;
}

module.exports = { postUser,
                   getUsers,
                   boardByDiff,
                   countUsers,
                   deleteUser
                 };