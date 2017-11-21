"use strict";

const mysql = require("mysql");

const config = {
  connectionLimit: 10, 
  host: "10.0.5.24",
  port: 3306,
  user: "root",
  password: "123456",
  database: "hema",
  multipleStatements: true 
};

const pool = mysql.createPool(config);

module.exports = pool;
