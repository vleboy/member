// 路由相关
const _ = require('lodash')
const moment = require('dayjs');
const Router = require('koa-router')
const router = new Router()
const ObjectId = require('mongodb').ObjectID

router.post('/query', async (ctx, next) => {
    let inparam = ctx.request.body
    let time = inparam.time.split("(")

    // let res ={achievements:['market',accumulate:0,current],amount}
    // 判断用户输入是否正确
    r = await mongodb.find('user', { id: inparam.userId })
    let market1 = null; let market2 = null
    let accumulate1 = 0
    let upCurrent1 = 0
    let downCurrent1 = 0
    let upAmount1 = 0
    let downAmount1 = 0
    let accumulate2 = 0
    let upCurrent2 = 0
    let downCurrent2 = 0
    let upAmount2 = 0
    let downAmount2 = 0
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

    if (market1 != null) {
        //计算market1的市场
        let r = await mongodb.find('achievement', { userId: inparam.userId, market: market1 })//查询累计市场

        r.map(item => {
            accumulate1 = item.achievements + accumulate1
            if (item.createdAt < moment(time[0]).startOf('month').add(14, 'day').valueOf() && item.createdAt > moment().startOf('month').valueOf()) {
                upCurrent1 = item.achievements + upCurrent1//上期
                upAmount1 = item.amount + upAmount1
            } else if (item.createdAt < moment(time[0]).endOf('month').valueOf() && item.createdAt > moment(time[0]).startOf('month').add(14, 'day').valueOf()) {
                downCurrent1 = item.achievements + downCurrent1
                downAmount1 = item.amount + downAmount1
            }
        })
    }

    if (market2 != null) {
        //计算market2的市场
        let r = await mongodb.find('achievement', { userId: inparam.userId, market: market2 })//查询累计市场

        r.map(item => {
            accumulate2 = item.achievements + accumulate2
            if (item.createdAt < moment(time[0]).startOf('month').add(14, 'day').valueOf() && item.createdAt > moment().startOf('month').valueOf()) {
                upCurrent2 = item.achievements + upCurrent2//上期
                upAmount2 = item.amount + upAmount2
            } else if (item.createdAt < moment(time[0]).endOf('month').valueOf() && item.createdAt > moment(time[0]).startOf('month').add(14, 'day').valueOf()) {
                downCurrent2 = item.achievements + downCurrent2
                downAmount2 = item.amount + downAmount2

            }
        })
    }
    if (time[1] == '上)') {
        if(upCurrent1 > upCurrent2){
            amount = upAmount2
        }else{
            amount = upAmount1
        }
        achievements.push({ market: market1, accumulate: accumulate1, current: upCurrent1 })
        achievements.push({ market: market2, accumulate: accumulate2, current: upCurrent2 })
    } else if (time[1] == '下)') {
        if(downCurrent1 > downCurrent2){
            amount = downAmount2
        }else{
            amount = downAmount1
        }
        achievements.push({ market: market1, accumulate: accumulate1, current: downCurrent1 })
        achievements.push({ market: market2, accumulate: accumulate2, current: downCurrent2 })
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
   let r = await mongodb.find('bill')
    let accumulateIn = 0
    let accumulateOut = 0
    let accumulateBalance = 0
    let accumulateMemberBalance = 0
   
    r.map(item => {
        if(item.type == 'IN'){
            accumulateIn  = accumulateIn + Math.abs(item.amount)
        }else if(item.type = 'OUT'){
            accumulateOut = accumulateOut + Math.abs(item.amount)
        }
    })
    // r =await mongodb.find('user')
    accumulateBalance = accumulateIn - accumulateOut
    r2 =await mongodb.find('user',{id : { '$ne':'root'}})
    r2.map(item=>{
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