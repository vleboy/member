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
const collection = 'bill'

/**
 * 新增账单中间件
 */
router.post('/bill/insert', async (ctx, next) => {
    let inparam = ctx.request.body
    let amount = Math.abs(inparam.amount)
    if (inparam.type == 'OUT') {
        amount *= -1
    }
    await mongodb.update('user', { _id: ObjectId(ctx._id) }, { $inc: { balance: amount } })
    return next()
})

router.post('/bill/query', async (ctx, next) => {
    //当前登录用户是否具备修改目标用户权限
    let body = ctx.body
    console.log(body)
    if (ctx.body.res.length > 0) {
        body.res[body.res.length - 1].balance = 0
        for (let index = 0; index < body.res.length; index++) {
            body.res[body.res.length - 1 - index].balance = 0
            if (body.res[body.res.length - 1 - index].type == 'IN') {
                if (index == 0) {
                    body.res[body.res.length - 1 - index].balance = body.res[body.res.length - 1 - index].balance + body.res[body.res.length - 1 - index].amount
                } else {
                    body.res[body.res.length - 1 - index].balance = body.res[body.res.length - index].balance + body.res[body.res.length - 1 - index].amount

                }


            } else if (body[body.length - 1 - index].type == 'OUT') {
                if (index == 0) {
                    body[body.length - 1 - index].balance = body[body.length - 1 - index].balance - body[body.length - 1 - index].amount
                } else {
                    body[body.length - 1 - index].balance = body[body.length - index].balance - body[body.length - 1 - index].amount

                }

            }

        }





    }
})

module.exports = router