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
 * 输入参数
 * @param name 产品名称
 * @param desc 产品描述
 * @param img 产品图片
 * @param price 产品价格
 * @param activity 产品活动
 * 
 * 生成参数
 * @param id 产品ID/编号
 */
router.post('/product/insert', async (ctx, next) => {
})

module.exports = router