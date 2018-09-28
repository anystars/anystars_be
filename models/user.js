const fetch = require('node-fetch')
const parse = require('parse-link-header')

module.exports.getUserInfo = token => {
  return new Promise(resolve => {
    fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "token " + token,
      }
    })
    .then(res => {
      // token 过期
      if (res.status === 401) resolve({status: 1})
      else {
        return res.json().then(res => {resolve({data: res, status:  0})})
      }
    })
    .catch(e => {
      console.log(e)
    })
  })
}

module.exports.getStarredRepoCount = token => {
  return new Promise(resolve => {
    fetch('https://api.github.com/user/starred?per_page=1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "token " + token,
      }
    })
    .then(res => {
      let linkHeader = res.headers.get('Link')
      if (linkHeader) {
        resolve(parse(linkHeader).last.page)
      } else {
        return res.json().then(res => {resolve(res.length)})
      }
    })
    .catch(e => {
      console.log(e)
    })
  })
}