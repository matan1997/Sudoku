const repo = require("../repository/leaderRepo");

const postUser  = async (ip, name, diff, mistake, time) => repo.postUser(ip, name, diff, mistake, time);

const getUsers = async () => repo.getUsers();

const boardByDiff = async (diff) => repo.boardByDiff(diff);

const countUsers = async () => repo.countUsers();

const deleteUser = async (oprator) => repo.deleteUser(oprator)

module.exports = { postUser,
                   getUsers,
                   boardByDiff,
                   countUsers,
                   deleteUser
                 };