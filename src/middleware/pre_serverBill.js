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
const collection = 'serverBill'
//check
const check = require('../util/check/bill')

/**
 * 新增账单中间件
 * 输入参数
 * @param type OUT IN
 * @param amount 金额
 * @param userId 用户ID
 * @param project 项目
 * @param remark 备注
 * 生成参数
 * @param id 订单ID/编号
 */


router.post('/serverBill/page', async (ctx, next) => {
    //当前登录用户是否具备修改目标用户权限
    let myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        throw { err: true, res: '当前为系统结算时间，请稍等再试' }
    }
    let token = ctx.tokenVerify
    if (token.role == 'admin' || token.id == toUser.userId) {
        ctx.request.body.sort = { createdAt: -1 }
        return next()
    } else {
        throw { err: true, res: '该用户没有提现权限' }
    }

})
module.exports = router