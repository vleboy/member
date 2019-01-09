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
const collection = 'order'

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
    
})

module.exports = router