const connection = require('./../config/db')

const getCategories = userId => {
  return new Promise(resolve => {
    var query = connection.query(`SELECT * from categories where user_id = ${userId}`, function (err, rows, fields) {
      if (err)
        throw err
      rows.push({id: 0, name: '未分类'})
      resolve(rows)
    })
  })
}

const addCategory = (newCategoryName, userId) => {
  return new Promise(resolve => {
    // 增
    connection.query('INSERT INTO categories(name, user_id) VALUES (?, ?)',
      [newCategoryName, userId], (err) => {
        // 返回所有列表
        getCategories(userId).then(rows => {
          resolve(rows)
        })
      })
  })

  // 关闭连接
  // connection.end();
}

const delCategory = (id, userId) => {
  return new Promise(resolve => {
    // 删
    connection.query('DELETE FROM categories WHERE id = (?) and user_id = (?)', [id, userId], (err, rows) => {
      // 返回所有列表
      getCategories(userId).then(rows => {
        resolve(rows)
      })
    })
  })

  // 关闭连接
  // connection.end();
}

module.exports.getCategories = getCategories
module.exports.addCategory = addCategory
module.exports.delCategory = delCategory