'use strict';

const mysqlPool = require('./mysqlpool');

module.exports = {
  /**
   * 从pool里获取connection
   */
  getConnection: () => {
    return new Promise(function (resolve, reject) {
      mysqlPool.getConnection(function (err, connection) {
        if (err) {
          reject({ code: 1, message: err });
          return;
        }
        resolve(connection);
        return;
      });
    });
  },
  /**
   * 在指定connection上开启事务
   */
  beginTransaction: (connection) => {
    return new Promise(function (resolve, reject) {
      connection.beginTransaction(function (err) {
        if (err) {
          reject({ code: 1, message: err });
          return;
        }

        resolve();
        return;
      });
    });
  },
  /**
   * 封装在指定的connection上执行query
   */
  query: (connection, sql, params) => {
    return new Promise(function (resolve, reject) {
      let query = connection.query(sql, params, function (err, results, fields) {
        console.log(query.sql);

        if (err) {
          reject({ code: 1, message: err });
          return;
        }

        resolve([results, fields]);
        return;
      });
    });
  },
  /**
   * 在指定connection上提交事务
   */
  commit: (connection) => {
    return new Promise(function (resolve, reject) {
      connection.commit(function (err) {
        if (err) {
          reject({ code: 1, message: err });
          return;
        }
        // 释放 连接
        connection.release();
        resolve();
        return;
      });
    });
  },
  /**
   * 在指定connection上回滚事务
   */
  rollback: (connection) => {
    return new Promise(function (resolve, reject) {
      connection.rollback(function (err) {
        if (err) {
          reject({ code: 1, message: err });
          return;
        }
        // 释放 连接
        connection.release();
        resolve();
        return;
      });
    });
  },
};