// 路由相关
const Router = require('koa-router')
const router = new Router()

router.get('/test', async (ctx, next) => {
    ctx.body = ctx.tokenVerify  // 获取TOKEN解析结果

})

// async function check(){
    
// }

// let map = {
//     'key':8,
//     'val':{
//         'A':0.1,
//         'B':0.2
//     }

// }
//A:[A]
//B1:[A,B1]
//B2:[A,B2]
//C1:[A,B2,C1]

module.exports = router