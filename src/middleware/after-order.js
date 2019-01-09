// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 日志相关
const _ = require('lodash')
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久化相关
 const ObjectId = require('mongodb').ObjectID
const collection = 'order'

/**
 * 新增订单中间件
 */
router.post('/order/insert', async (ctx, next) => {
    let inparam = ctx.request.body
    let amount = inparam.price * -1
    await mongodb.update('user', { _id: ObjectId(ctx._id) }, { $inc: { balance: amount } })
    return next()
})

module.exports = router