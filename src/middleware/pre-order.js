// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 日志相关
const _ = require('lodash')
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久化相关
//const ObjectId = require('mongodb').ObjectID
const collection = 'order'
const productCollection = 'product'
const check = require('../util/check/order')
/**
 * 新增订单中间件
 * 输入参数
 * @param products 产品数组[{id,price,num}]
 * @param price 订单价格
 * @param userId 用户ID
 * @param deliveryName 收货人
 * @param deliveryMobile 收货人电话
 * @param deliveryAddress 收货地址
 * 
 * 生成参数
 * @param id 订单ID/编号
 */
router.post('/order/insert', async (ctx, next) => {
    let token = ctx.tokenVerify
    let inparam = ctx.request.body
    let priceRes = 0

    check(inparam)
    //1.校验当前订单产品是否存在
    let recIdArry = []
    let inparamIdArry = []
    inparam.products.map((item) => {
        inparamIdArry.push(item.id)
    })
    const r = await mongodb.find(productCollection, { id: { "$in": inparamIdArry } })
    r.map((item) => {
        recIdArry.push(item.id)
    })
    let x = _.difference(inparamIdArry, recIdArry)
    if (x.length != 0) {
        throw { err: true, res: `产品【${x}】不存在或已下架` }
    }
    r.map((item) => {
        inparam.products.map((i) => {
            if (i.id == item.id) {
                if (i.price == item.price) {
                    i.name = r.name
                    priceRes += (item.price * i.num)
                } else {
                    throw { err: true, res: `订单价格信息不正确` }
                }
            }
        })
    })
    let tokenRes = await mongodb.find('user', { id: token.id })
    if (tokenRes[0].balance < priceRes) {
        throw { err: true, res: `下单失败，余额不足，当前余额为${tokenRes[0].balance},订单金额为${priceRes}` }
    }
    inparam.deliveryAddress = tokenRes.deliveryAddress
    inparam.deliveryMobile = tokenRes.deliveryMobile
    inparam.deliveryName = tokenRes.deliveryName
    inparam.price = priceRes
    inparam.id = 'D' + _.random(000000, 999999)
    inparam.createdAt = Date.now()
    ctx._id = token._id
    return next()
})

/**
 * 查询订单中间件
 */
router.post('/order/query', async (ctx, next) => {
    let token = ctx.tokenVerify
    let inparam = ctx.request.body
    if (inparam.key) {
        inparam['$or'] = [{ id: inparam.key }, { userId: inparam.key }]
        delete inparam.key
    }
    return next()
})

module.exports = router