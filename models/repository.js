const fetch = require('node-fetch')
const connection = require('./../config/db')
const {getRemarks} = require('./remark.js')
const Fuse = require('fuse.js')

// 获取数据库中所保存的所 star 的所有 repo 的结构化对象字符串数据
const getRepos = userId => {
  return new Promise(resolve => {
    var query = connection.query(`SELECT * from repositories where user_id = ${userId}` , function (err, rows) {
      if (err)
        throw err
      if (rows.length === 0 || rows[0].str.trim() === '') resolve('[]')
      else resolve(rows[0].str)
    })
  })
}

// 从 GitHub 上获取最新的 starred repos 数据
const getNewestRepos = (token, starredCount) => {
  function getPromise(pageNum) {
    return new Promise(resolve => {
      fetch(`https://api.github.com/user/starred?per_page=100&page=${pageNum}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "token " + token,
          'Accept': 'application/vnd.github.VERSION.star+json',
          // 'Time-Zone': 'Asia/Shanghai'
        }
      })
      .then(res => {
        let data = res.json()
        resolve(data)
      })
      .catch(e => {
        console.log(e)
      })
    })
  }

  const promiseArr = []
  let pages = Math.ceil(starredCount / 100)
  
  for (let i = 1; i <= pages; i++) {
    promiseArr.push(getPromise(i))
  }

  return new Promise(resolve => {
    Promise.all(promiseArr).then(res => {
      let ret = []
      res.forEach(item => {
        ret.push(...item)
      })
      resolve(ret)
    })
  })
}

// 根据 getNewestAllRepos 所获得的数据，更新结构化对象字符串
const updateRepos = (dataStr, userId) => {
  return new Promise(resolve => {
    // 如果有则更新，没有则新建
    var query = connection.query(`SELECT * from repositories where user_id = ${userId}`, function (err, rows) {
      if (err)
        throw err

      if (rows.length) {
        connection.query(`UPDATE repositories SET str = (?) where user_id = (?)`, [dataStr, userId], err => {
          resolve()
        })
      } else {
        connection.query('INSERT INTO repositories(str, user_id) VALUES (?, ?)',
          [dataStr, userId], err => {
            resolve()
        })
      }
    });
  })
  
  // 关闭连接
  connection.end();
}

// 更新结构化对象中的 Category
const updateCategory = (id, category, userId) => {
  return new Promise(resolve => {
    var query = connection.query(`SELECT * from repositories where user_id = ${userId}`, function (err, rows) {
      const repos = JSON.parse(rows[0].str)

      repos.forEach(item => {
        // 模糊比较，这里因为 int 类型不能传到后端
        // 思考，如何把 int 类型 get/post 给后端？让后端能够获取到 int，而不是 string
        if (item.repo.id == id) { 
          item.category = category
        }
      })

      // 改
      connection.query(`UPDATE repositories SET str = (?) where user_id = ${userId}`, [JSON.stringify(repos)], err => {
        resolve(repos)
      });
    });
    
  }).catch(err => {})
}

// 删除分类，将该分类的 repo 改为 0（未分类）
const emptyCategory = (id, userId) => {
  return new Promise(resolve => {
    getRepos(userId).then(repos => {
      repos = JSON.parse(repos)
      repos.forEach(repo => {
        if (repo.category == id) {
          repo.category = 0 // 改为未分类
        }
      })

      updateRepos(JSON.stringify(repos), userId).then(() => {
        resolve(repos)
      })
    })
  })
}

// 获取一个 repo readme 的数据
const getRepoDetail = fullName => {
  return new Promise(resolve => {
    fetch(`https://api.github.com/repos/${fullName}/readme`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.VERSION.html+json'
      }
    })
    .then(res => {
      resolve(res.text())
    })
    .catch(e => {
      console.log(e)
    })
  })
}

const starRepo = (fullName, token) => {
  return new Promise(resolve => {
    fullName = 'hanzichi/codedog'
    fetch(`https://api.github.com/user/starred/${fullName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "token " + token,
        'Content-Length': 0
      }
    })
    .then(res => {
      resolve()
    })
    .catch(e => {
      console.log(e)
    })
  })
}

const unstarRepo = (fullName, token) => {
  return new Promise(resolve => {
    fetch(`https://api.github.com/user/starred/${fullName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "token " + token,
      }
    })
    .then(res => {
      resolve()
    })
    .catch(e => {
      console.log(e)
    })
  })
}

// fuzzy search, see <http://fusejs.io/> for more
const getFuzzySearchResults = async (userId, keyWord) => {
  let repos = await getRepos(userId)
  repos = JSON.parse(repos)
  let remarks = await getRemarks(userId)

  repos.forEach(repo => {
    remarks.forEach(remark => {
      if (repo.repo.id === remark.repo_id) {
        repo.remark = remark.remark
      }
    })
  })

  var options = {
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    // tokenize: true,
    // matchAllTokens: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,

    keys: [
      // {name: "remark", weight: 0.6},
      // {name: "repo.description", weight: 0.2},
      // {name: "repo.full_name", weight: 0.2},
      "remark",
      "repo.description",
      "repo.full_name"
    ]
  }
  
  var fuse = new Fuse(repos, options) // "repos" is the item array
  var result = fuse.search(keyWord)

  return result
}

module.exports = {
  getRepos,
  getNewestRepos,
  updateRepos,
  updateCategory,
  getRepoDetail,
  starRepo, 
  unstarRepo,
  getFuzzySearchResults,
  emptyCategory
}