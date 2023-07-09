// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const schema = new Schema({
//     ip: {type: String, required: true},
//     name: {type: String, required: true},
//     diff: {type: String, required: true},
//     score: {type: Number, required: true} 
// });

// module.exports = mongoose.model('Leaderboard', schema);

const db = require('./db');
//User constructor
function User ({
    date,
    ip, 
    name, 
    diff,
    mistake, 
    time,
}) {
    this.date = date;
    this.ip = ip;
    this.name = name;
    this.diff = diff;
    this.mistake = mistake;
    this.time = time;
};

// add a createUser method to the prototype
User.prototype.createUser = async function() {
    try {
        const { rows } = await db.query(
            `INSERT INTO public_soduku_lb(ip, name, diff, mistake, time) 
            VALUES ($1, $2, $3, $4, $5)`,
            [this.date, this.ip, this.name, this.diff, this.mistake, this.time]
        );
        return rows; 
    } catch (error) {
        console.log(`didnt insert ${this.date} ${this.ip} ${this.name} ${this.diff} ${this.mistake} ${this.time}`);
        throw error;
    }
};

module.exports = User;