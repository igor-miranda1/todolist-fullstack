const mysql = require('mysql2/promise');

require('dotenv').config();


const connection = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DB || 'todolist'

});

module.exports = connection;