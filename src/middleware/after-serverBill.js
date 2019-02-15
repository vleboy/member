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
const collection = 'serverBill'



router.post('/serverBill/page', async (ctx, next) => {
    //当前登录用户是否具备修改目标用户权限
    let bodyRes = _.filter(ctx.body.res,item=>{
        return item.userId != 'root'
    })


    let body = ctx.body
   console.log('body',body)
   
    // if (body.res.length > 0) {
    //     body.res[body.res.length - 1].balance = 0
    //     for (let index = 0; index < body.res.length; index++) {
    //         body.res[body.res.length - 1 - index].balance = 0
    //   //      console.log(index)
    //         if (body.res[body.res.length - 1 - index].type == 'IN') {
    //             if (index == 0) {
    //                 body.res[body.res.length - 1 - index].balance = body.res[body.res.length - 1 - index].balance +  Math.abs(body.res[body.res.length - 1 - index].amount)
    //             } else {
    //                 body.res[body.res.length - 1 - index].balance = body.res[body.res.length - index].balance +Math.abs(body.res[body.res.length - 1 - index].amount) 

    //             }


    //         } else if (body.res[body.res.length - 1 - index].type == 'OUT') {
    //             if (index == 0) {
    //                 body.res[body.res.length - 1 - index].balance = body.res[body.res.length - 1 - index].balance -  Math.abs(body.res[body.res.length - 1 - index].amount)
    //             } else {
    //                 body.res[body.res.length - 1 - index].balance = body.res[body.res.length - index].balance - Math.abs(body.res[body.res.length - 1 - index].amount)

    //             }

    //         }

    //     }
    //  }
    if (bodyRes.length > 0) {
        bodyRes[bodyRes.length - 1].balance = 0
        for (let index = 0; index < bodyRes.length; index++) {
            bodyRes[bodyRes.length - 1 - index].balance = 0
      //      console.log(index)
            if (bodyRes[bodyRes.length - 1 - index].type == 'IN') {
                if (index == 0) {
                    bodyRes[bodyRes.length - 1 - index].balance = bodyRes[bodyRes.length - 1 - index].balance +  Math.abs(bodyRes[bodyRes.length - 1 - index].amount)
                } else {
                    bodyRes[bodyRes.length - 1 - index].balance = bodyRes[bodyRes.length - index].balance +Math.abs(bodyRes[bodyRes.length - 1 - index].amount) 

                }


            } else if (bodyRes[bodyRes.length - 1 - index].type == 'OUT') {
                if (index == 0) {
                    bodyRes[bodyRes.length - 1 - index].balance = bodyRes[bodyRes.length - 1 - index].balance -  Math.abs(bodyRes[bodyRes.length - 1 - index].amount)
                } else {
                    bodyRes[bodyRes.length - 1 - index].balance = bodyRes[bodyRes.length - index].balance - Math.abs(bodyRes[bodyRes.length - 1 - index].amount)

                }

            }

        }
     }
     ctx.body.res = bodyRes
})

module.exports = router