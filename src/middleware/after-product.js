// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 日志相关
const _ = require('lodash')
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久化相关
// const ObjectId = require('mongodb').ObjectID
const collection = 'product'

/**
 * 新增产品中间件
 */
router.post('/product/insert', async (ctx, next) => {
    // let r = await mongodb.find(collection)
    // r.map((item)=>{
    //     item.num = 0
    // })
    // ctx.body = { err: false, res: r } 
})

router.post('/product/query', async (ctx, next) => {


    let r = await mongodb.find(collection)
    r.map((item) => {
        item.num = 0
    })
    ctx.body = { err: false, res: r }
    return next()
})
module.exports = router