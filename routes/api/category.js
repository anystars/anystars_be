const router = require('koa-router')()
const fetch = require('node-fetch')
const querystring = require('querystring')
const path = require('path')

router.prefix('/api')

const {
  getCategories,
  addCategory,
  delCategory
} = require('./../../models/category')

router.get('/getCategories', async (ctx, next) => {
  const userId = ctx.query.userId
  const res = await getCategories(userId)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.post('/addCategory', async (ctx, next) => {
  const newCategoryName = ctx.request.body.newCategoryName
  const userId = ctx.request.body.userId
  const res = await addCategory(newCategoryName, userId)
  ctx.body = {
    status: 0,
    data: res
  }
})

router.post('/delCategory', async (ctx, next) => {
  const id = ctx.request.body.id
  const userId = ctx.request.body.userId
  const res = await delCategory(id, userId)
  ctx.body = {
    status: 0,
    data: res // 新的目录列表
  }
})

module.exports = router