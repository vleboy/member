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
const collection = 'user'
// 处理函数逻辑
const check = require('../util/check/user')
const checkUpdate = require('../util/check/update')
/**
 * 注册用户中间件
 * 输入参数
 * @param username 姓名                         必填，非唯一 2-8
 * @param idnumber 证件号码                     必填，非唯一
 * @param mobile 手机号                         必填，唯一
 * @param wechatnumber 微信号                   非必填，非唯一
 * @param bankname 银行                        非必填，非唯一
 * @param banknumber 银行卡号                   非必填，非唯一
 * @param password 密码                         必填，非唯一
 * @param level 级别                            必填，非唯一
 * @param address 地址                          必填，非唯一
 * @param parentId 安置编号                 
 * @param recommendnumber 推荐编号              必填，唯一
 * 内置属性
 * @param referralBonuses 邀请奖励钱包           
 * referralBonuses{status:'null/phase1/phase2',phase1:id,第一阶段奖励值（他儿子激活时选择的套餐价格的20%），phase2:id第二阶段奖励值（通常他儿子激活时选择的套餐价格的80%，但是若phase1=0,那么这里只能是套餐价格20%）}
 * @param areaWallet 市场奖励
 * @param leaderWallet 领导奖励
 * 
 * 
 * @param deliveryName 收货人
 * @param deliveryMobile 收货人电话
 * @param deliveryAddress 收货地址
 * 
 * 生成参数
 * @param id 用户ID/编号，用于程序业务处理
 * @param status {status:状态：init待审核，freeze冻结，normal正常,activateAt:状态改变金额,price:状态金额，当激活用户时候选择的套餐金额}
 * @param levelIndex 安置关系                   必填，
 * @param recommendIndex  推荐关系
 */
router.post('/user/insert', async (ctx, next) => {
    let inparam = ctx.request.body
    // 检测输入正确性
    check(inparam)

    // 判断是否重复
    let r = await mongodb.find(collection, { mobile: inparam.mobile })
    if (r.length > 0) {
        throw { err: true, res: '电话号码已存在' }
    }
    else {
        ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid
    }
    //查找推荐人
    r = await mongodb.find(collection, { id: inparam.recommendnumber })
    if (r.length > 0) {
        //找到推荐人，配置自己的推荐ID
        inparam.id = 'MY' + _.random(10000000, 99999999).toString()
        inparam.recommendIndex = r[0].recommendIndex
        inparam.recommendIndex.push((inparam.id))
        inparam.status = inparam.status|| 'init'
        inparam.activateAt= null
        inparam.price=0

    } else {
        if (inparam.recommendnumber == 'root') {
            inparam.id = 'root'
            inparam.recommendIndex = [inparam.id]//系统第一人
            inparam.status = inparam.status || 'normal'
            inparam.activateAt= Date.now()
            inparam.price=0
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
        if (r[0].levelIndex.indexOf(a[0].id) == -1) {
            throw { err: true, res: '该安置编码不合理' }//该安置编码不合理
        }
        //只能在激活的用户下安置新用户
        if (r[0].status == 'init') {
            throw { err: true, res: '只能在激活的用户下安置新用户' }//该安置编码不合理
        }
        //上级的点位数只能为2个
        //console.log(r[0].referralBonuses)
        if (r[0].referralBonuses.phase1.id != null && r[0].referralBonuses.phase2.id != null) {
            throw { err: true, res: `安置编码下已经存在了两个点位分别是【${r[0].referralBonuses.phase1.id}】和【${r[0].referralBonuses.phase1.id}】,请查证` }
        } else if (r[0].referralBonuses.phase1.id != null) {
            let o = r[0].referralBonuses
            o.phase2.id = inparam.id
            await mongodb.update('user', { id: r[0].id }, { $set: { referralBonuses: o } })
        } else if (r[0].referralBonuses.phase2.id != null) {
            let o = r[0].referralBonuses
            o.phase1.id = inparam.id
            await mongodb.update('user', { id: r[0].id }, { $set: { referralBonuses: o } })
        } else {
            let o = r[0].referralBonuses
            o.phase1.id = inparam.id
            await mongodb.update('user', { id: r[0].id }, { $set: { referralBonuses: o } })
        }
        inparam.referralBonuses = {
            status: 'null',
            phase1: { id: null, price: 0 },
            phase2: { id: null, price: 0 }
        }

        inparam.levelIndex = r[0].levelIndex
        inparam.levelIndex.push(inparam.id)
    } else {
        if (inparam.parentId == 'root') {
            inparam.levelIndex = [inparam.id]//系统第一人
            inparam.referralBonuses = {
                status: 'null',
                phase1: { id: null, price: 0 },
                phase2: { id: null, price: 0 }
            }
        } else {
            throw { err: true, res: '安置编码错误，请查证' }//没有找到安置编码
        }
    }
    // 判断安置编码和推荐编码是否唯一
    r = await mongodb.find(collection, { '$or': [{ parentId: inparam.id }, { recommendnumber: inparam.id }] })

    if (r.length > 0) {
        throw { err: true, res: '网络错误，请重试' }
    } else {
        inparam.createdAt = Date.now()
        inparam.balance = 0; inparam.iswechatpay = false
        ctx.body = { err: false, res: inparam.id }  // 返回检查结果和生成的openid
        return next()
    }
})

/**
 * 更新用户中间件
 */
router.post('/user/update', async (ctx, next) => {
    //当前登录用户是否具备修改目标用户权限
    let token = ctx.tokenVerify
    let inparam = ctx.request.body
    if (!inparam.status) {
        checkUpdate(inparam)
    } else {
        ctx._id = inparam._id
    }
    if (token._id == inparam._id) {
        return next()
    } else {
        throw { err: true, res: '该用户没有修改权限' }
    }
})

/**
 * 删除用户中间件
 */
router.get('/user/delete/:_id', async (ctx, next) => {
    //当前登录用户是否具备修改目标用户权限
    let token = ctx.tokenVerify
    let inparam = ctx.params
    console.log(inparam)
    let r = await mongodb.find('user',{_id:ObjectId(inparam._id)})
    let f =await mongodb.find('user',{id:r[0].parentId})
    let referral = _.cloneDeep(f[0].referralBonuses) 
  
    if (referral.phase1.id == r[0].id){
        referral.phase1.id = null
        
    }else if(referral.phase2.id == r[0].id){
        referral.phase2.id = null
    }
    console.log(referral)
    await mongodb.update('user',{id:r[0].parentId},{'$set':{referralBonuses:referral}})
    if (token.role == 'admin') {
        return next()
    } else {
        throw { err: true, res: '该用户没有删除权限' }
    }
})

/**
 * 查询用户中间件
 */
router.post('/user/page', async (ctx, next) => {
    let token = ctx.tokenVerify
    let inparam = ctx.request.body
    inparam.sort = { createdAt: -1 }
    if (inparam.key) {
        inparam['$or'] = [{ id: inparam.key }, { username: inparam.key }, { mobile: inparam.key }]
        delete inparam.key
    }
    return next()
})

module.exports = router