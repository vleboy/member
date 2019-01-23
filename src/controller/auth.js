// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 认证相关
const jwt = require('jsonwebtoken')
// 工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久化相关
const ObjectId = require('mongodb').ObjectID
const collection = 'user'
// 检测相关
const check = require('../util/check/login')
// 1、登录，生成加密TOKEN令牌
router.use('/login', async (ctx, next) => {
    const inparam = ctx.request.body
    check(inparam)
    const r = await mongodb.find(collection,{"$or":[ { id: inparam.id },{mobile:inparam.mobile}]})
  
   
    if (r.length > 0) {
        inparam._id = r[0]._id ; inparam.id = r[0].id
        if (inparam.password && inparam.password == r[0].password && inparam.id == 'root'){
            ctx.tokenSign = jwt.sign({ role:'admin',_id:r[0]._id,id: r[0].id, username: r[0].username, exp: Math.floor(Date.now() / 1000) + 3600 * 24 }, config.auth.secret)    // 向后面的路由传递TOKEN加密令牌
            return next()
        }else if (inparam.password && inparam.password == r[0].password){
            ctx.tokenSign = jwt.sign({ _id:r[0]._id,id: r[0].id, username: r[0].username, exp: Math.floor(Date.now() / 1000) + 3600 * 24 }, config.auth.secret)    // 向后面的路由传递TOKEN加密令牌
            return next()
        }else{
            ctx.body = { err: true, res: '用户密码校验错误' }
        }
       
    } else {
        // ctx.status = 401
        ctx.body = { err: true, res: '用户不存在' }
    }
})

// 2、向前端传递TOKEN加密令牌
router.post('/login', async (ctx, next) => {
    let res = {
        token:ctx.tokenSign,
        _id:ctx.request.body._id,
        id:ctx.request.body.id
    }
    ctx.body = { err: false, res: res }
})

// 3、下次其余路由需要在请求时在header中加上token参数，如果没有token或者token错误，xauth中间件会提示错误
router.get('/test', async (ctx, next) => {
    ctx.body = ctx.tokenVerify  // 获取TOKEN解析结果
})

module.exports = router