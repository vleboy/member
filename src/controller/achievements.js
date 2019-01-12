// 路由相关
const _ = require('lodash')
const moment = require('moment');
const Router = require('koa-router')
const router = new Router()
const ObjectId = require('mongodb').ObjectID
router.post('/test', async (ctx, next) => {
    myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 3) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        throw { err: true, res: '当前为系统结算时间，请稍等再试' }
    }
    let token = ctx.tokenVerify  // 获取TOKEN解析结果
    if (token.role != 'admin') {
        throw { err: true, res: '当前账号没有权限' }
    }
    let inparam = ctx.request.body
    const people = await mongodb.find('user', { id: inparam.id })//查出当前状态变更的用户
    const father = await mongodb.find('user', { id: people[0].parentId })//查出当前状态变更的用户的上级
    inparam.people = people; inparam.father = father;
    inparam.price = inparam.initPrice
    let a = await updateUser(inparam, myDate)
    let b = await getReferralBonuses(inparam, myDate)
    let c = await getMarketBonuses(inparam, myDate)
    

    ctx.body = { err: false, res: 'sucess' }

    //更新奖励状态
    //更新用户状态
})

async function updateUser(inparam, date) {
    console.log('激活价格',inparam.price)
    if (inparam.people[0].status.status != 'normal') {
        await mongodb.update('user', { _id: ObjectId(inparam.people[0]._id) }, { $set: { status: { status: 'normal', activateAt: moment(date).valueOf(), price: inparam.price } } })
    } else {
        console.log('已激活')
    }
}

//推荐奖与回本奖
//规则1.每个人当天所获得的市场奖不能大于5000元。
//规则2.奖金金额按照当前所得奖金者的左右区中扣除掉第一层金额的金额总和之小区的15%计算
//规则3.每天的00:00~00:03,23:57~24:00,为系统结算期，此时不予激活用户
//规则4.领导奖为当前获得市场奖的人的上级50%，上上级20%，上上上级10%
async function getReferralBonuses(inparam, date) {
    inparam.id          //当前激活用户
    inparam.initPrice   //当前激活选择的用户的套餐价格


    if (inparam.people.length > 0 && inparam.people[0].id != 'root') {
        //通过当前用户的安置信息


        if (inparam.father[0].referralBonuses.status == 'null') {
            //第一阶段奖励
            //更新状态
            let o = inparam.father[0].referralBonuses
            o.status = 'phase1'; o.phase1.id = inparam.id; o.phase1.price = inparam.initPrice * 0.2
            console.log('1', o)
            await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })

            //  await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: { status: 'phase1', phase1: { id: inparam.id, price: inparam.initPrice * 0.2 } } } })
            await mongodb.insert('achievement', { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第一阶段' })
            return { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第一阶段' }
        } else if (inparam.father[0].referralBonuses.status == 'phase1' && inparam.father[0].referralBonuses.phase1.id != inparam.id) {
            //判断phase1是否为0套餐
            if (inparam.father[0].referralBonuses.phase1.price != 0) {
                let o = inparam.father[0].referralBonuses
                o.status = 'phase2'; o.phase2.id = inparam.id; o.phase2.price = inparam.initPrice * 0.8
                console.log('2', o)
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
                // await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: { status: 'phase1', phase2: { id: inparam.id, price: inparam.initPrice * 0.8 } } } })
            } else {
                let o = inparam.father[0].referralBonuses
                o.status = 'phase2'; o.phase2.id = inparam.id; o.phase2.price = inparam.initPrice * 0.2
                console.log('3', o)
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
                //await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: { status: 'phase2', phase2: { id: inparam.id, price: inparam.initPrice * 0.2 } } } })
            }
            //更新业绩（余额，在当期结算时根据业绩更新）
            await mongodb.insert('achievement', { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.8), createdAt: moment(date).valueOf(), remark: '第二阶段' })
            return { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第二阶段' }
        } else if (inparam.father[0].id != 'root') {

            throw { err: true, res: '该账户的父级账户已经完成推荐奖或已存在该ID' }
        }
    } else {
        throw { err: true, res: '找不到该激活用户，或该账户为root' }
    }
}


async function getMarketBonuses(inparam, date) {
    //如果当前当前状态变更的用户，位置等级小于3,则不会出现市场奖
    let AchievementsBonuses = []
    let AchievementsBonuse = { userId: '', project: '市场奖', type: 'IN', amount: 0, createdAt: moment(date).valueOf(), remark: '当期市场奖', surplus: 0 }
    console.log('当前用户层级长度', inparam.people[0].levelIndex.length)
    if (inparam.people[0].levelIndex.length < 3) {
        return
    }
    console.log(`当前用户长度符合要求`)
    //获取当前可能需要返奖的用户
    let bonuseUser = inparam.people[0].levelIndex.reverse()
    let revPeopleLevelIndex = bonuseUser
    if (bonuseUser.length > 0) {
        bonuseUser = _.drop(bonuseUser, 2)
    }
    let root = await mongodb.find('user', { levelIndex: 'root' })
    //找到该用户的左区和该用户的右区
    for (let index = 0; index < bonuseUser.length; index++) {
        //for (let index = 0; index < 1; index++) {
        let activeBonuses = []
        root.map((item) => {
            if (item.levelIndex.indexOf(bonuseUser[index]) != -1) {
                activeBonuses.push(item)
            }
        })
        let left = []; let right = [];let leftName = [] ;let rightName = []
        activeBonuses.map((item) => {
            if (item.id != bonuseUser[index]) {
                if (item.levelIndex.indexOf(revPeopleLevelIndex[index + 1]) != -1) {
                    left.push(item)
                    leftName.push(item.username)
                } else {
                    right.push(item)
                    rightName.push(item.username)
                }
            }
        })
        console.log(`BonuseUser:${bonuseUser[index]},left:${leftName},right:${rightName}`)
        //处理订单逻辑
        let leftPrice = 0; let rightPrice = 0;
        let rr = await mongodb.find('user',{id:bonuseUser[index]})
        console.log('rr',rr)
        left.map((item) => {
            if (item.id != rr[0].referralBonuses.phase1.id && item.id != rr[0].referralBonuses.phase2.id) {
                leftPrice = item.status.price + leftPrice
                console.log('leftPrice',leftPrice)
            }

        })//计算左区金额
        right.map((item) => {
            if (item.id != rr[0].referralBonuses.phase1.id && item.id != rr[0].referralBonuses.phase2.id) {
                rightPrice = item.status.price + rightPrice
                console.log('rightPrice',rightPrice)
            }
        })//计算右区金额
        if (leftPrice <= rightPrice) {
            
            AchievementsBonuse.amount = leftPrice * 0.15//左区计奖
        } else {
            
            AchievementsBonuse.amount = rightPrice * 0.15//右区计奖
        }
        AchievementsBonuse.userId = bonuseUser[index]
        //判断当日是否已经拥有5000
        //获取第二日0点

        let r = await mongodb.find('achievement', { userId: bonuseUser[index], project: '市场奖' })

        //let a = moment(r[0].createdAt).isBefore()

        //console.log(moment(date).isBefore(moment(r[0].createdAt).endOf('day')))

        if (r.length > 0) {
            //已经存在过奖励
            let Bonuses = r[0].amount + AchievementsBonuse.amount - r[0].surplus
            console.log('AchievementsBonuse_已经',AchievementsBonuse,'之前的奖励是',r[0].amount)
            if (Bonuses > 5000) { AchievementsBonuse.amount = 5000, AchievementsBonuse.surplus = Bonuses - 5000 }
            else { AchievementsBonuse.amount = Bonuses }
            console.log('AchievementsBonuse',AchievementsBonuse)
            if (moment(date).isBefore(moment(r[0].createdAt).endOf('day'))) {
                let o = r[0]
                o.amount = AchievementsBonuse.amount; o.createdAt = moment(date).valueOf()
                await mongodb.update('achievement', { _id: ObjectId(r[0]._id) }, { $set: o }) //更新

                //await mongodb.update('achievement', { _id: ObjectId(r[0]._id) }, { $set: { amount: AchievementsBonuse, createdAt: moment(date).valueOf() } }) //更新
            } else {
                await mongodb.insert('achievement', AchievementsBonuse) //新建
            }

        } else {
            console.log('AchievementsBonuse_新建',AchievementsBonuse)
            await mongodb.insert('achievement', AchievementsBonuse)//第一次获得市场奖 新建
        }

        //AchievementsBonuses.push(AchievementsBonuse)
        console.log('AchievementsBonuseEnd',AchievementsBonuse)
        let leaderLevel1 = AchievementsBonuse.amount * 0.50
        let leaderLevel2 = AchievementsBonuse.amount * 0.20
        let leaderLevel3 = AchievementsBonuse.amount * 0.10
        let leader = rr.levelIndex.reverse()
        let leaderBonuse = { userId: '', project: '领导奖', type: 'IN', amount: 0, createdAt: moment(date).valueOf(), remark: '领导奖'}

        if(leader[1]){
            leaderBonuse.userId = leader[1]
            leaderBonuse.amount = leaderLevel1
            await mongodb.insert('achievement',leaderBonuse)
        }
        if(leader[2]){
            leaderBonuse.userId = leader[2]
            leaderBonuse.amount = leaderLevel2
            await mongodb.insert('achievement',leaderBonuse)
        }
        if(leader[3]){
            leaderBonuse.userId = leader[3]
            leaderBonuse.amount = leaderLevel3
            await mongodb.insert('achievement',leaderBonuse)
        }
        
        //await mongodb.insert('achievement', AchievementsBonuse)//第一次获得市场奖 新建


    }

    //获取用户安置的根用户
    //获取当前用户所在层级
    //判断当前层级是否能够触发返奖
    //判断触发返奖的用户数组
    //记录需要返奖业绩，但不更新余额（余额需要在结算期更新，这里只更新业绩信息）
}


module.exports = router