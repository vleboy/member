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
const product = 'product'
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
    let inparam = ctx.request.body
    let priceRes= 0
    let r = null
    check(inparam)
    //1.校验当前订单产品是否存在
    for (let index = 0; index < inparam.products.length; index++) {
         r = await mongodb.find(product,{id:inparam.products[index].id})
         if(r.length > 0){
            priceRes += r[0].price * inparam.products[index].num
         }else{
             throw { err: true, res: `产品【${inparam.products[index].id}】不存在或已下架` }
         }
    }

    if(priceRes != inparam.price || priceRes < 0){
        throw { err: true, res: `订单价格信息不正确` }
    }
    inparam.createdAt = Date.now()
    return next()


})

module.exports = router