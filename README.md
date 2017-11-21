# nodejs 版本的 mysql 操作示例

## SQL
初始化SQL语句： [点我查看](https://raw.githubusercontent.com/ruicky/node_mysql/master/util/InitSQL.sql)

## 依赖包

1. [mysql](https://www.npmjs.com/package/mysql) 用来连接mysql
2. [moment](https://www.npmjs.com/package/moment) 用来处理时间

## 上代码

[具体点击这里查看](./index.js)

> 增

```
/**
 *  增加
 * 
 * @param {Object} params {name:姓名, mobile:电话, mail:邮箱}
 * @returns  
 */
function Add(params) {
  return new Promise(async function(resolve, reject) {
    let customer = {
      name: params.name,
      mobile: params.mobile,
      mail: params.mail
    };
    let sql = "INSERT INTO customer SET ?;";
    let query = mysqlPool.query(sql, [product], function(error, results, fields) {
      console.log(query.sql);
      if (err) {
        reject({ code: 1, data: {}, message: err.message });
        return;
      }
      resolve({
        code: 0,
        data: {
          id: results[0].insertId
        },
        message: "success"
      });
    });
  });
}
```

> 删

```
/**
 * 删除
 * 
 * @param {any} params {id:id}
 * @returns 
 */
function Delete(params) {
  return new Promise(async function(resolve, reject) {
    let id = parseInt(params.id);
    let sql = "DELETE FROM customer WHERE id = ?;";
    let query = mysqlPool.query(sql, [id], function(err, results, fields) {
      console.log(query.sql);
      if (err) {
        return reject({ code: 1, message: err.message });
      }
      return resolve({
        code: 0,
        data: { rows: results.affectedRows },
        message: "success"
      });
    });
  });
}
```

> 改

```
/**
 * 修改
 * 
 * @param {any} params {id:id, name:姓名, mobile:电话, mail:邮箱}
 * @returns
 */
function Update(params) {
    return new Promise(function(resolve, reject) {
      let id = parseInt(params.id);
      let sql = "UPDATE customer SET ? WHERE id = ?;";
      let query = mysqlPool.query(sql, [params, params.id], function( err, results, fields) {
        console.log(query.sql);
        if (err) {
          return reject({ code: 1, data: {}, message: err.message });
        }
        if (results.affectedRows <= 0) {
          return reject({ code: 1, data: {}, message: "update faile" });
        }

        return resolve({ code: 0, data: {}, message: "success" });
      });
    });
}
```

> 查

```
/**
 * 查询
 * 
 * @param {any} params {pageIndex:页码, pageSize:每页大小, name:姓名, mobile:电话, mail:邮箱}
 * @returns
 */
function Select(params) {
  return new Promise(function(resolve, reject) {
    let pageIndex = parseInt(params.pageIndex);
    let pageSize = parseInt(params.pageSize);
    // 默认值
    if (pageIndex <= 0) {
      pageIndex = 1;
    }

    if (!pageSize) {
      pageSize = 10;
    }
    let limitFrom = (pageIndex - 1) * pageSize;
    let limitTo = pageIndex * pageSize;
    let limitClause = ` LIMIT ${mysqlPool.escape(
      limitFrom
    )}, ${mysqlPool.escape(limitTo)} `;
    let whereClause = ` WHERE 1 = 1 `;

    if (name) {
      whereClause += ` AND c.name like %${mysqlPool.escape(name)}%`;
    }

    if (mobile) {
      whereClause += ` AND c.mobile = ${mysqlPool.escape(mobile)}`;
    }
    if (mail) {
      whereClause += ` AND c.mail = ${mysqlPool.escape(mail)}`;
    }

    let sql = `
      SELECT c.*
      FROM customer c
      ${whereClause} ${limitClause}; 
  
      SELECT FOUND_ROWS() AS totalCount;`;
    let query = mysqlPool.query(sql, function(err, results, fields) {
      console.log(query.sql);

      if (err) {
        return reject({ code: 1, data: {}, message: err.message });
      }

      // 格式化时间
      let list = results[0].map(p => {
        p.created = moment(p.created).format("YYYY-MM-DD HH:mm:ss");
        return p;
      });

      return resolve({
        code: 0,
        data: {
          pageIndex,
          pageSize,
          totalCount: results[1][0].totalCount,
          totalPage: Math.ceil(results[1][0].totalCount / pageSize), // 总页数
          list
        },
        message: "success"
      });
    });
  });
}
```

> 事务

```
/**
 * 事务
 * 业务逻辑：先添加用户在添加地址
 * @param {any} params {name:姓名, mobile:电话, mail:邮箱, address:地址}
 * @returns 
 */
function insertTransaction (params) {
    return new Promise(async function(resolve, reject) {
        let connection;
        try{
            connection = await mysql.getConnection();
            // 开启事务
            await mysql.beginTransaction(connection);
    
            let customer = {
              name: params.name,
              mobile: params.mobile,
              mail: params.mail,
            };
      
            let sql = 'INSERT INTO customer SET ?;';
    
            let customerResult = await mysql.query(connection, sql, [customer]);
            let customerId = customerResult[0].insertId;
            
            let address = {
                customerId: customerId,
                address: params.address
            }

            let addressSql = 'INSERT INTO address SET ?;';
            let addressResult = await mysql.query(connection, addressSql, [address]);
            let addressId = addressResult[0].insertId;

            // 提交事务
            await mysql.commit(connection);
            return resolve({
                code: 0,
                data:{
                    customerId,
                    addressId
                },
                message: 'success'
            });
    
          } catch (err) {
            console.trace(err);
            // 回滚事务
            await mysql.rollback(connection);
            return reject({
              code: 1,
              data: {},
              message: err.message,
            });
          }

    })
}
```