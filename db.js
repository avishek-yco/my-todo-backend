const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_app_db',
  password: '0415',
  port: 5432, 
});

module.exports = pool;
