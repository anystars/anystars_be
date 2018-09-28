const connection = require('./../config/db')

const addRemark = (repoId, userId, remark) => {
  return new Promise(resolve => {
    // 如果有则更新，没有则新建
    var query = connection.query(`SELECT * from remarks where user_id = ${userId} and repo_id = ${repoId}`, function (err, rows) {
      if (err)
        throw err

      if (rows.length) {
        connection.query(`UPDATE remarks SET remark = (?) where user_id = (?) and repo_id = (?)`, [remark, userId, repoId], err => {
          getRemarks(userId).then(res => {resolve(res)})
        })
      } else {
        connection.query('INSERT INTO remarks(repo_id, user_id, remark) VALUES (?, ?, ?)',
          [repoId, userId, remark], err => {
            getRemarks(userId).then(res => {resolve(res)})
          })
      }
    });
  })

  // 关闭连接
  connection.end();
}

const getRemarks = userId => {
  return new Promise(resolve => {
    var query = connection.query(`SELECT * from remarks where user_id = ${userId}`, function (err, rows) {
      if (err)
        throw err

      resolve(rows)
    })
  })

  // 关闭连接
  // connection.end();
}

module.exports.addRemark = addRemark
module.exports.getRemarks = getRemarks