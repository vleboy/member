// 路由相关
const _ = require('lodash')
const moment = require('dayjs');
const Router = require('koa-router')
const router = new Router()
const ObjectId = require('mongodb').ObjectID

router.post('/query', async (ctx, next) => {
    let inparam = ctx.request.body
    let time = inparam.time.split("(")
    let myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        throw { err: true, res: '当前为系统结算时间，请稍等再试' }
    }
    // let res ={achievements:['market',accumulate:0,current],amount}
    // 判断用户输入是否正确
    r = await mongodb.find('user', { id: inparam.userId })
    let market1 = null; let market2 = null
    let accumulate1 = 0
    let upCurrent1 = 0  //上期的市场1当前
    let downCurrent1 = 0//下棋的市场1当前
    let upAmount1 = 0   //上期的市场1累计
    let downAmount1 = 0 //下棋的市场1累计
    let accumulate2 = 0 
    let upCurrent2 = 0  //上期的市场2当前
    let downCurrent2 = 0//下棋的市场2当前
    let upAmount2 = 0   //上期的市场2累计
    let downAmount2 = 0 //下棋的市场2累计
    let amount = 0
    let achievements = []
    if (r.length > 0) {
        //找到当前查询用户的referralBonuses中的状态
        if (r[0].referralBonuses.status != 'null') {
            market1 = r[0].referralBonuses.phase1.id
            market2 = r[0].referralBonuses.phase2.id
        }
    } else {

        throw { err: true, res: `查询不到该用户【${inparam.userId}】，请查证` }
    }

    if (time[1] == '上)') {
        let timeGo = moment(time[0]).startOf('month').valueOf()
        let timeEnd = moment(time[0]).startOf('month').add(15, 'day').valueOf()
        if (market1 != null) {
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market1, createdAt: {  '$lte': timeEnd } })//查询累计市场
            r.map(item=>{
                upAmount1  = item.achievements + upAmount1
                if(item.createdAt >= timeGo){
                    upCurrent1 = item.achievements + upCurrent1
                }
            })
          //  achievements.push({ market: market1, accumulate: upAmount1, current: upCurrent1 })
            
        }
        if (market2 != null){
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market2, createdAt: {  '$lte': timeEnd } })//查询累计市场
            r.map(item=>{
                upAmount2  = item.achievements + upAmount2
                if(item.createdAt >= timeGo){
                    upCurrent2 = item.achievements + upCurrent2
                }
            })
           // achievements.push({ market: market2, accumulate: upAmount2, current: upCurrent2 })
        }
        //查询上一期
         let lastTimeGo = moment(time[0]).subtract(1, 'months').startOf('month').add(15, 'day').valueOf()
         let lastTimeEnd = moment(time[0]).subtract(1, 'months').endOf('month').valueOf()
         let lastdownachievements1 = 0
         let lastdownachievements2 = 0
         if (market1 != null) {
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market1, createdAt: {  '$lte': lastTimeEnd } })//查询累计市场
            r.map(item=>{
                
                
                lastdownachievements1 = item.achievements + lastdownachievements1
               
            })
            
        }
        if (market2 != null){
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market2, createdAt: {  '$lte': lastTimeEnd } })//查询累计市场
            r.map(item=>{
               
               
                lastdownachievements2 = item.achievements + lastdownachievements2
                
            })
            
        }
        if (lastdownachievements1>lastdownachievements2){
            upCurrent1 = upCurrent1 + lastdownachievements1 - lastdownachievements2
        }else{
            upCurrent2 = upCurrent2 + lastdownachievements2 - lastdownachievements1
        }
        achievements.push({ market: market1, accumulate: upAmount1, current: upCurrent1 })
        achievements.push({ market: market2, accumulate: upAmount2, current: upCurrent2 })
    } else if (time[1] == '下)') {
        let timeGo = moment(time[0]).startOf('month').add(15, 'day').valueOf()
        let timeEnd = moment(time[0]).endOf('month').valueOf()
        console.log(moment(time[0]).startOf('month').add(15, 'day').format())
        console.log(moment(time[0]).endOf('month').format())
        if (market1 != null) {
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market1, createdAt: {  '$lte': timeEnd } })//查询累计市场
            r.map(item=>{
                downAmount1  = item.achievements + downAmount1
                if(item.createdAt >= timeGo){
                    downCurrent1 = item.achievements + downCurrent1
                }
            })
            
        }
        if (market2 != null){
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market2, createdAt: {  '$lte': timeEnd } })//查询累计市场
            r.map(item=>{
                downAmount2 =  item.achievements + downAmount2
                if(item.createdAt >= timeGo){
                    downCurrent2 = item.achievements + downCurrent2
                }
            })
            
        }
       
         let lastTimeGo = moment(time[0]).subtract(1, 'months').startOf('month').valueOf()
         let lastTimeEnd = moment(time[0]).subtract(1, 'months').startOf('month').add(15, 'day').valueOf()
         let lastdownachievements1 = 0
         let lastdownachievements2 = 0
         if (market1 != null) {
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market1, createdAt: {  '$lte': lastTimeEnd } })//查询累计市场
            r.map(item=>{
                
                
                lastdownachievements1 = item.achievements + lastdownachievements1
               
            })
            
        }
        if (market2 != null){
            let r = await mongodb.find('achievement', { userId: inparam.userId, market: market2, createdAt: {  '$lte': lastTimeEnd } })//查询累计市场
            r.map(item=>{
               
               
                lastdownachievements2 = item.achievements + lastdownachievements2
                
            })
            
        }

        if (lastdownachievements1>lastdownachievements2){
            upCurrent1 = upCurrent1 + lastdownachievements1 - lastdownachievements2
        }else{
            upCurrent2 = upCurrent2 + lastdownachievements2 - lastdownachievements1
        }
        achievements.push({ market: market1, accumulate: downAmount1, current: downCurrent1 })
        achievements.push({ market: market2, accumulate: downAmount2, current: downCurrent2 })


    }
    
    ctx.body = { err: false, res: { achievements, amount } }
    // console.log('o',o)
    //ctx.body = {}
    // { text: "市场", value: "market", 
    //     { text: "累积业绩", value: "accumulate", 
    //     { text: "本期业绩", value: "current",
    //     { text: "奖金", value: "amount",

    // ctx.body= {err:false,res}
})

router.post('/stat', async (ctx, next) => {

    let r = await mongodb.find('serverBill', { userId: { '$ne': 'root' } })
    let accumulateIn = 0
    let accumulateOut = 0
    let accumulateBalance = 0
    let accumulateMemberBalance = 0
    console.log(r.length)
    r.map(item => {
        if (item.type == 'IN') {
            accumulateIn = accumulateIn + Math.abs(item.amount)
        } else if (item.type = 'OUT') {
            accumulateOut = accumulateOut + Math.abs(item.amount)
        }
    })
    // r =await mongodb.find('user')
    accumulateBalance = accumulateIn - accumulateOut
    r2 = await mongodb.find('user', { userId: { '$ne': 'root' } })
    r2.map(item => {
        accumulateMemberBalance = accumulateMemberBalance + item.balance
    })
    ctx.body = {
        err: false, res: {
            accumulateIn: accumulateIn,
            accumulateOut: accumulateOut,
            accumulateBalance: accumulateBalance,
            accumulateMemberBalance: accumulateMemberBalance
        }
    }
})
module.exports = router