/// connect to our database

const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    password: "qwerty",
    host: "localhost",
    port: 5432, //automatically runs on this port
    database: "IOT"

});

module.exports = pool;