const mysql      = require('mysql')
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345', // my mac
  database: 'anystars',
  charset: 'utf8mb4'
})

// 连接数据库
connection.connect()

module.exports = connection