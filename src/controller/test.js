// 路由相关
const _ = require('lodash')
const moment = require('moment');
const Router = require('koa-router')
const router = new Router()
const ObjectId = require('mongodb').ObjectID

router.get('/query', async (ctx, next) => {


    let ooo ={
        amount:11,
        createdAt:1547518962553
    }
    
    await mongodb.update('achievement', { _id: ObjectId('5c3d4512a4fd52011e413945')}, { $set: ooo })

    

})


module.exports = router

