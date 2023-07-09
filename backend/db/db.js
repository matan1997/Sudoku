require("dotenv").config();

const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: `${process.env.DB_HOST}`,  //localhost
  database: 'postgres', //postgres
  password: 'Aa123456',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected!");
});

console.log(`process.env.DB_URL : ${process.env.DB_HOST}`);

module.exports = client;
