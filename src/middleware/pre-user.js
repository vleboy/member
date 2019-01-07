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
// 处理函数逻辑>
const check = require('../util/check/user')
/**
 * 注册用户中间件
 * 输入参数
 * @param username 姓名                         必填，非唯一 2-8
 * @param idnumber 证件号码                     必填，非唯一
 * @param mobile 手机号                         必填，唯一
 * @param wechatnumber 微信号                   非必填，非唯一
 * @param bankname 银行                         非必填，非唯一
 * @param banknumber 银行卡号                   非必填，非唯一
 * @param password 密码                         必填，非唯一
 * @param level 级别                            必填，非唯一
 * @param address 地址                          必填，非唯一
 * @param placenumber 安置编号                  必填，唯一
 * @param recommendnumber 推荐编号              必填，唯一
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
    let inparam = ctx.request.body
    // 
    check(inparam)

    // 6位随机ID
    inparam.id = inparam.id || _.random(100000, 999999).toString()
    inparam.parentId = inparam.parentId || inparam.placenumber
    // 判断是否重复
    const r = await mongodb.find(collection, { "$or": [{ username: inparam.username }, { id: inparam.id }, { mobile: inparam.mobile }] })
    if (r.length > 0) {
       throw { err: true, res: '用户已存在' }
    }
    else {
        ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid
        return next()
    }
})

/**
 * 更新用户中间件
 */
router.post('/user/update', async (ctx, next) => {
})

module.exports = router