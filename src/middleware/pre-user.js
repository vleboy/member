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
const collection = 'user'

/**
 * 注册用户中间件
 * 输入参数
 * @param username 姓名
 * @param idnumber 证件号码
 * @param mobile 手机号
 * @param wechatnumber 微信号
 * @param bankname 银行
 * @param banknumber 银行卡号
 * @param password 密码
 * @param level 级别
 * @param address 地址
 * @param placenumber 安置编号
 * @param recommendnumber 推荐编号
 * 
 * @param deliveryName 收货人
 * @param deliveryMobile 收货人电话
 * @param deliveryAddress 收货地址
 * 
 * 生成参数
 * @param id 用户ID/编号，用于程序业务处理
 * @param parentId 父级ID/编号，用于程序业务处理
 * @param status 状态：init待审核，freeze冻结，normal正常
 */
router.post('/user/insert', async (ctx, next) => {
    const mongodb = global.mongodb
    const inparam = ctx.request.body
    // 数据检查
    if (!inparam.username || inparam.username.length < 2 || inparam.username.length > 5) {
        ctx.body = { err: true, res: '名字2-5个字' }
    }
    //  业务处理
    else {
        // 6位随机ID
        inparam.id = inparam.id || _.random(100000, 999999).toString()
        // 判断是否重复
        const r = await mongodb.find(collection, { "$or": [{ username: inparam.username }, { id: inparam.id }] })
        if (r.length > 0) {
            ctx.body = { err: true, res: '用户已存在' }
        } else if (inparam.isPreCheck) {
            ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid
        } else {
            return next()
        }
    }
})

/**
 * 更新用户中间件
 */
router.post('/user/update', async (ctx, next) => {
})

module.exports = router