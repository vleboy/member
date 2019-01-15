// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久化相关
const ObjectId = require('mongodb').ObjectID
const collection = 'user'
//加入业绩处理相关
const achievements = require('../server/achievements')
/**
 * 注册中间件
 */
router.post('/user/insert', async (ctx, next) => {
    const inparam = ctx.request.body
    let o ={}
    o.token=jwt.sign({ id: inparam.id, username: inparam.username, exp: Math.floor(Date.now() / 1000) + 3600 * 24 }, config.auth.secret)
    o.userid = inparam.id
    o.username = inparam.username
    ctx.body.res = o
})

/**
 * 更新用户中间件
 */
router.post('/user/update', async (ctx, next) => {

    let inparam = ctx.request.body
    if(inparam.status != 'normal'){
        return next()
    }


    myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        throw { err: true, res: '当前为系统结算时间，请稍等再试' }
    }
    let token = ctx.tokenVerify  // 获取TOKEN解析结果
    if (token.role != 'admin') {
        throw { err: true, res: '当前账号没有权限' }
    }

    const people = await mongodb.find('user', { _id: ObjectId(ctx._id) })//查出当前状态变更的用户
    if (people.length == 0) {
        throw { err: true, res: `找不到当前_id:${inparam}对应的用户，请查证` }
    }
    const father = await mongodb.find('user', { id: people[0].parentId })//查出当前状态变更的用户的上级
    inparam.people = people; inparam.father = father;
    inparam.price = inparam.initPrice
    //记录需要返奖业绩，但不更新余额（余额需要在结算期更新，这里只更新业绩信息）
 
    await achievements.updateUser(inparam, myDate)
    await achievements.getReferralBonuses(inparam, myDate)
    await achievements.getMarketBonuses(inparam, myDate)
    ctx.body = { err: false, res: 'sucess' }
})

module.exports = router