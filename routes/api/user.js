const router = require('koa-router')()
const fetch = require('node-fetch')
const querystring = require('querystring')
const path = require('path')

router.prefix('/api')

const {
  getToken,
  getUserInfo,
  getStarredRepoCount
} = require('./../../models/user')

router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.request.headers['x-token']
  const res = await getUserInfo(token)
  ctx.body = res
})

router.get('/getStarredRepoCount', async (ctx, next) => {
  const token = ctx.request.headers['x-token']
  const res = await getStarredRepoCount(token)
  ctx.body = {
    status: 0,
    data: res
  }
})

module.exports = router