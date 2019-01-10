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
// 处理函数逻辑
const check = require('../util/check/product')
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
    check(ctx.request.body)

    inparam = ctx.request.body
    inparam.id = inparam.id || _.random(100000, 999999).toString()
    inparam.createdAt = Date.now()
    const r = await mongodb.find(collection, { "$or": [{ id: inparam.id }, { name: inparam.name }] })
    if (r.length > 0) {
        throw { err: true, res: '产品已存在' }
    }
    else {
        ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid
        return next()
    }

})
router.post('/product/query', async (ctx, next) => {


    let token = ctx.tokenVerify
    console.log(token)
        if(token){
            let r= await mongodb.find(collection)
            ctx.body = { err: false, res: r }  // 返回检查结果和生成的openid
            return next()
        }else{
            throw { err: true, res: 'token 错误' }
        }

})
module.exports = router