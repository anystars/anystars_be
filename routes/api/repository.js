const router = require('koa-router')()
const fetch = require('node-fetch')
const querystring = require('querystring')
const path = require('path')

router.prefix('/api')

const {
  getRepos,
  getNewestRepos,
  updateRepos,
  updateCategory,
  getRepoDetail,
  starRepo, 
  unstarRepo,
  getFuzzySearchResults,
  emptyCategory
} = require('./../../models/repository')

router.get('/emptyCategory', async (ctx, next) => {
  const userId = ctx.query.userId
  const id = ctx.query.id
  const res = await emptyCategory(id, userId)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.get('/getRepos', async (ctx, next) => {
  const userId = ctx.query.userId
  const res = await getRepos(userId)
  ctx.body = {
    status: 0,
    data: JSON.parse(res)
  }
})

router.get('/getRepoDetail', async (ctx, next) => {
  const fullName = ctx.query.fullName
  let html = await getRepoDetail(fullName)

  // 图片如果是保存在 GitHub 仓库里的，相对路径需要转为绝对路径
  const baseUrl = `https://github.com/${fullName}`
  const p = /(<img.*src=")(.+?")/g

  html = html.replace(p, (a, b, c, d) => {
    if (!c.includes('http')) { // 相对路径
      return b + path.join(baseUrl, 'raw/master', c)
    } else {
      return a
    }
  })

  ctx.body = {
    status: 0,
    data: html
  }
})

router.get('/getNewestRepos', async (ctx, next) => {
  const {starredCount} = ctx.query
  const token = ctx.request.headers['x-token']
  const res = await getNewestRepos(token, starredCount)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.post('/addRepos', async (ctx, next) => {
  const {repos, userId} = ctx.request.body
  console.log(JSON.parse(repos).length)
  await updateRepos(repos, userId)
  ctx.body = {
    status: 0
  }
})

router.post('/updateCategory', async (ctx, next) => {
  const {id, category, userId } = ctx.request.body
  let res = await updateCategory(id, category, userId)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.post('/starRepo', async (ctx, next) => {
  const {fullName} = ctx.request.body
  const token = ctx.request.headers['x-token']
  let res = await starRepo(fullName, token)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.post('/unstarRepo', async (ctx, next) => {
  const {fullName} = ctx.request.body
  const token = ctx.request.headers['x-token']
  let res = await unstarRepo(fullName, token)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.get('/getFuzzySearchResults', async (ctx, next) => {
  const userId = ctx.query.userId
  const keyWord = ctx.query.keyWord
  const res = await getFuzzySearchResults(userId, keyWord)
  ctx.body = {
    status: 0,
    data: res
  }
})


module.exports = router