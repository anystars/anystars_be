const router = require('koa-router')()

router.prefix('/api')

const {addRemark, getRemarks} = require('./../../models/remark')

router.post('/addRemark', async (ctx, next) => {
  const {
    repoId,
    userId,
    remark
  } = ctx.request.body

  const res = await addRemark(repoId, userId, remark)

  ctx.body = {
    status: 0,
    data: res
  }
})

router.get('/getRemarks', async (ctx, next) => {
  const userId = ctx.query.userId
  const res = await getRemarks(userId)
  ctx.body = {
    status: 0,
    data: res
  }
})

module.exports = router