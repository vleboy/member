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
// 处理函数逻辑
const check = require('../util/check/user')
const checkLogin = require('../util/check/update')
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
 * @param parentId 安置编号                 
 * @param recommendnumber 推荐编号              必填，唯一
 * 
 * @param deliveryName 收货人
 * @param deliveryMobile 收货人电话
 * @param deliveryAddress 收货地址
 * 
 * 生成参数
 * @param id 用户ID/编号，用于程序业务处理
 * @param status 状态：init待审核，freeze冻结，normal正常
 * @param levelIndex 安置关系                   必填，
 * @param recommendIndex  推荐关系
 */
router.post('/user/insert', async (ctx, next) => {
    let inparam = ctx.request.body
    // 检测输入正确性
    check(inparam)

    // 6位随机ID
    // inparam.id = inparam.id || _.random(100000, 999999).toString()
    // inparam.parentId = inparam.parentId || inparam.placenumber
    inparam.status = inparam.status || 'init'
    // 判断是否重复
    let r = await mongodb.find(collection, { "$or": [{ username: inparam.username }, { mobile: inparam.mobile }] })
    if (r.length > 0) {
        throw { err: true, res: '用户名或电话已存在' }
    }
    else {
        ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid

    }
    //查找推荐人
    r = await mongodb.find(collection, { id: inparam.recommendnumber })
    // let recommen  = r[0].recommendnumber
    if (r.length > 0) {
        //找到推荐人，配置自己的推荐ID
        inparam.id = 'MY' + _.random(10000000, 99999999).toString()
        inparam.recommendIndex = r[0].recommendIndex
        inparam.recommendIndex.push((inparam.id))


    } else {
        if (inparam.recommendnumber === 'root') {
            inparam.id = 'root'
            inparam.recommendIndex = [inparam.id]//系统第一人

        } else {
            throw { err: true, res: '推荐编号错误，请查证' }//没有找到推荐人
        }

    }
    // 安置编码
    r = await mongodb.find(collection, { id: inparam.parentId })

    if (r.length > 0) {//找到安置编码，判断是否能在此安置编码下面安置
        //找到推荐编码

        let a = await mongodb.find(collection, { id: inparam.recommendnumber })
        //将推荐人的安置编码与填写的安置编码人的安置关系对比

        //console.log(a[0]) //推荐人对象
        //console.log(r[0]) //放置位置的父级对象
        //查看推荐人的安置编码是否在提交的安置编码人下的安置关系中
        if (r[0].levelIndex.indexOf(a[0].id) === -1) {

            throw { err: true, res: '该安置编码不合理' }//该安置编码不合理
        }
        
        inparam.levelIndex = r[0].levelIndex
        inparam.levelIndex.push(inparam.id)
    } else {
        if (inparam.parentId === 'root') {
            inparam.levelIndex = [inparam.id]//系统第一人

        } else {
            throw { err: true, res: '安置编码错误，请查证' }//没有找到安置编码
        }

    }
    // 判断安置编码和推荐编码是否唯一
    r = await mongodb.find(collection, { parentId: inparam.id })
    if (r.length > 0) {

        throw { err: true, res: '网络错误，请重试' }
    } else {
        ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid
        return next()

    }

})

/**
 * 更新用户中间件
 */
router.post('/user/update', async (ctx, next) => {

    //当前登录用户是否具备修改目标用户权限
    let fromUser = ctx.tokenVerify
    //console.log('fromUser:',fromUser)
    let toUser = ctx.request.body
    checkLogin(toUser)
    let r = await mongodb.find(collection , {id:fromUser.id})
    if (r.length > 0){
        if (fromUser.role === 'admin' || r[0].id === toUser.id){
            return next()
        }else{
            throw {err:true , res: '该用户没有修改权限'}
        }
    }else{
        throw {err:true , res: 'token 错误'}
    }
})

module.exports = router