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

/**
 * 新增订单中间件
 */
router.post('/order/insert', async (ctx, next) => {
    let retailBonuse = { userId: '', project: '零售奖', type: 'IN', amount: 100, createdAt: Date.now(), remark: '零售奖' }
    let inparam = ctx.request.body
    let amount = inparam.price * -1
    //await mongodb.insert('bill', { userId: inparam.userId, type: 'OUT', amount:Math.abs(amount) , createdAt: Date.now() ,remark:inparam.id,project:'购买产品'})
    await mongodb.insert('bill', { userId: inparam.userId, type: 'IN', amount:0, createdAt: Date.now() ,remark:inparam.id,project:'购买产品'})

    await mongodb.update('user', { _id: ObjectId(ctx._id) }, { $inc: { balance: amount } })
    let r =  await mongodb.find('user', { _id: ObjectId(ctx._id) })
    //添加零售奖
    
    let userIdGrup = r[0].recommendIndex.reverse()
    if(userIdGrup[1]){
        let le = _.cloneDeep(retailBonuse)
        le.userId = userIdGrup[1]
        await mongodb.insert('achievement', le) 
    }
    if(userIdGrup[2]){
        let le = _.cloneDeep(retailBonuse)
        le.userId = userIdGrup[2]
        await mongodb.insert('achievement', le) 
    }

    ctx.body = { err: false, res: inparam.id }
    return next()
})

module.exports = router