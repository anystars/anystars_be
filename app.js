const Koa = require('koa')
const cors = require('@koa/cors');

const app = new Koa()

app.use(cors());

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const category = require('./routes/api/category')
const repository = require('./routes/api/repository')
const user = require('./routes/api/user')
const remark = require('./routes/api/remark')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  'formLimit':'50mb',
  'jsonLimit':'50mb',
  'textLimit':'50mb',
  queryString: {
    arrayLimit: 10000,
    depth: 50,
    parameterLimit: 10000,
  }
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(repository.routes(), repository.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(remark.routes(), remark.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!')
  console.error('server error', err, ctx)
});

// demos/16.js
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('捕捉到错误啦！！！！')
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    };
  }
};

app.use(handler);

module.exports = app
