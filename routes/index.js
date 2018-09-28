const router = require('koa-router')()

router.get('/cb', async (ctx, next) => {
  await ctx.render('cb', {})
})

module.exports = router