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
const collection = 'bill'
//check
const check = require('../util/check/bill')

/**
 * 新增账单中间件
 * 输入参数
 * @param type OUT IN
 * @param amount 金额
 * @param userId 用户ID
 * 
 * 生成参数
 * @param id 订单ID/编号
 */
router.post('/bill/insert', async (ctx, next) => {
    let fromUser = ctx.tokenVerify
    console.log('fromUser:',fromUser)
    let toUser = ctx.request.body
    check(toUser)
    let r = await mongodb.find('user' , {id:fromUser.id})
    if (r.length > 0){
        if (fromUser.role === 'admin' || r[0].id === toUser.userId){
            return next()
        }else{
            throw {err:true , res: '该用户没有体现权限'}
        }
    }else{
        throw {err:true , res: 'token 错误'}
    }
})

router.post('/bill/query', async (ctx, next) => {

    //当前登录用户是否具备修改目标用户权限
    let fromUser = ctx.tokenVerify
    let r = await mongodb.find('user' , {id:fromUser.id})
    if (r.length > 0){
        if (fromUser.role === 'admin' || r[0].id === toUser.userId){
            return next()
        }else{
            throw {err:true , res: '该用户没有体现权限'}
        }
    }else{
        throw {err:true , res: 'token 错误'}
    }
})
module.exports = router