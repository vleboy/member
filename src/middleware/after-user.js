// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久化相关
// const ObjectId = require('mongodb').ObjectID
const collection = 'user'

/**
 * 注册中间件
 */
router.post('/user/insert', async (ctx, next) => {
    const inparam = ctx.request.body
    ctx.body.res = jwt.sign({ id: inparam.id, username: inparam.username, exp: Math.floor(Date.now() / 1000) + 3600 * 24 }, config.auth.secret)
})

/**
 * 更新用户中间件
 */
router.post('/user/update', async (ctx, next) => {
})

module.exports = router