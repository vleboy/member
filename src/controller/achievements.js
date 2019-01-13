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
    //记录需要返奖业绩，但不更新余额（余额需要在结算期更新，这里只更新业绩信息）
    await updateUser(inparam, myDate)
    await getReferralBonuses(inparam, myDate)
    await getMarketBonuses(inparam, myDate)


    ctx.body = { err: false, res: 'sucess' }

    //更新奖励状态
    //更新用户状态
})

async function updateUser(inparam, date) {
    console.log(`开始激活当前用户【${inparam.people.id}】`)
    console.log(`当前用户【${inparam.people.id}】激活套餐价格为${inparam.price}`)
    if (inparam.people[0].status.status != 'normal') {
        await mongodb.update('user', { _id: ObjectId(inparam.people[0]._id) }, { $set: { status: { status: 'normal', activateAt: moment(date).valueOf(), price: inparam.price } } })
    } else {
        console.log(`当前用户【${inparam.people.id}】已激活`)
    }
}

//推荐奖与回本奖
//规则1.以安置位置来算，若旗下有一名非0点位成员，获得该成员点位金额的20%
//规则2.以安置位置来算，若旗下有两名非0点位成员，获得该成员点位金额的100%
//规则3.以安置点位来算, 若旗下有一名0点位成员，获得其中非0点位成员点位金额的20%
async function getReferralBonuses(inparam, date) {
    inparam.id          //当前激活用户
    inparam.initPrice   //当前激活选择的用户的套餐价格

    console.log('开始计算推荐奖')
    if (inparam.people.length > 0 && inparam.people[0].id != 'root') {
        //通过当前用户的安置信息


        if (inparam.father[0].referralBonuses.status == 'null') {
            //第一阶段奖励


            //更新状态
            let o = inparam.father[0].referralBonuses
            o.status = 'phase1'; o.phase1.id = inparam.id; o.phase1.price = inparam.initPrice * 0.2
            console.log(`用户【${inparam.father[0].id}】获得第一阶段推荐奖`)
            console.log(`用户【${inparam.father[0].id}】第一阶段的推荐奖奖金系数为0.2`)
            console.log(`用户${inparam.father[0].id}获得第一阶段推荐奖，奖金为${o.phase1.price}`)

            await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
            await mongodb.insert('achievement', { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第一阶段' })
            return { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第一阶段' }
        } else if (inparam.father[0].referralBonuses.status == 'phase1' && inparam.father[0].referralBonuses.phase1.id != inparam.id) {
            //判断phase1是否为0套餐
            console.log(`用户【${inparam.father[0].id}】获得第二阶段推荐奖`)
            console.log(`开始判断用户【${inparam.father[0].id}】第一阶段的推荐奖奖金是否为0`)
            if (inparam.father[0].referralBonuses.phase1.price != 0) {
                console.log(`用户【${inparam.father[0].id}】第一阶段的推荐奖奖金为【${inparam.father[0].referralBonuses.phase1.price}】`)
                console.log(`用户【${inparam.father[0].id}】第二阶段的推荐奖奖金系数为0.8`)
                let o = inparam.father[0].referralBonuses
                o.status = 'phase2'; o.phase2.id = inparam.id; o.phase2.price = inparam.initPrice * 0.8
                console.log(`用户${inparam.father[0].id}获得第二阶段推荐奖，奖金为${o.phase2.price}`)
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
            } else {
                console.log(`用户【${inparam.father[0].id}】第一阶段的推荐奖奖金为0`)
                console.log(`用户【${inparam.father[0].id}】第二阶段的推荐奖奖金系数为0.2`)
                let o = inparam.father[0].referralBonuses
                o.status = 'phase2'; o.phase2.id = inparam.id; o.phase2.price = inparam.initPrice * 0.2
                console.log(`用户${inparam.father[0].id}获得第二阶段推荐奖，奖金为${o.phase2.price}`)
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
            }
            //更新业绩（余额，在当期结算时根据业绩更新）
            await mongodb.insert('achievement', { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.8), createdAt: moment(date).valueOf(), remark: '第二阶段' })
            return { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第二阶段' }
        } else if (inparam.father[0].id != 'root') {

            console.log('该账户的父级账户已经完成推荐奖或已存在该ID')
        }
    } else {
        throw { err: true, res: '找不到该激活用户，或该账户为root' }
    }
}

//市场奖和领导奖
//规则1.每个人当天所获得的市场奖不能大于5000元。
//规则2.奖金金额按照当前所得奖金者的左右区中扣除掉第一层金额的金额总和之小区的15%计算
//规则3.每天的00:00~00:03,23:57~24:00,为系统结算期，此时不予激活用户
//规则4.领导奖为当前获得市场奖的人的直接推荐人获得50%，直接推荐人的推荐人20%，直接推荐人的推荐人的推荐人10%
async function getMarketBonuses(inparam, date) {

    let AchievementsBonuse = { userId: '', project: '市场奖', type: 'IN', amount: 0, createdAt: moment(date).valueOf(), remark: '当期市场奖', surplus: 0 }

    //如果当前当前状态变更的用户，位置等级小于3,则不会出现市场奖
    if (inparam.people[0].levelIndex.length < 3) {
        console.log(`当前用户【${inparam.people[0].id}】层级长度为【`, inparam.people[0].levelIndex.length, '】不会出现市场奖励')
        return
    }
    console.log(`当前用户【${inparam.people[0].id}】层级长度为【${inparam.people[0].levelIndex.length}】, 可能会出现市场奖励'`)
    //获取当前可能需要返奖的用户
    let bonuseUserIdGroup = inparam.people[0].levelIndex.reverse()
    let nowPeopleLevelIndex = bonuseUserIdGroup
    if (bonuseUserIdGroup.length > 0) {
        bonuseUserIdGroup = _.drop(bonuseUserIdGroup, 2)
    }
    //获取所有用户的信息
    let root = await mongodb.find('user', { levelIndex: 'root' })
    //判断可能需要返奖的用户哪些需要返奖
    for (let index = 0; index < bonuseUserIdGroup.length; index++) {
        //从可能需要返奖的组里抽出一个人

        let activeBonuses = []
        //查出该人的有效记奖励点位
        root.map((item) => {
            if (item.levelIndex.indexOf(bonuseUserIdGroup[index]) != -1) {
                activeBonuses.push(item)
            }
        })
        //将有效奖励点位，分区
        let left = []; let right = []; let leftName = []; let rightName = []
        activeBonuses.map((item) => {
            if (item.id != bonuseUserIdGroup[index]) {
                if (item.levelIndex.indexOf(nowPeopleLevelIndex[index + 1]) != -1) {
                    left.push(item)
                    leftName.push(item.username)
                } else {
                    right.push(item)
                    rightName.push(item.username)
                }
            }
        })
        console.log(`当前可能获取奖励的用户【${bonuseUserIdGroup[index]}】其有效奖励点位左区为:【${leftName}】,右区为:【${rightName}】`)
        //处理奖励逻辑
        let leftPrice = 0; let rightPrice = 0;
        let bonuseUser = await mongodb.find('user', { id: bonuseUserIdGroup[index] })
        console.log('开始计算当前可能获取奖励的用户【', bonuseUser[0].id, '】的左区金额')
        //计算左区金额
        left.map((item) => {
            if (item.id != bonuseUser[0].referralBonuses.phase1.id && item.id != bonuseUser[0].referralBonuses.phase2.id) {
                leftPrice = item.status.price + leftPrice
                // console.log('leftPrice', leftPrice)
            }
        })
        console.log('左区金额统计完毕，为【', leftPrice, '】')
        console.log('开始计算当前可能获取奖励的用户【', bonuseUser[0].id, '】的右区金额')
        //计算右区金额
        right.map((item) => {
            if (item.id != bonuseUser[0].referralBonuses.phase1.id && item.id != bonuseUser[0].referralBonuses.phase2.id) {
                rightPrice = item.status.price + rightPrice
                // console.log('rightPrice', rightPrice)
            }
        })
        console.log('右区金额统计完毕，为【', rightPrice, '】')
        console.log('开始计算当前可能获取奖励的用户【', bonuseUser[0].id, '】的右区金额')
        console.log('开始对比左区与右区的金额大小，并计算出总奖励金额')
        if (leftPrice <= rightPrice) {

            AchievementsBonuse.amount = leftPrice * 0.15//左区计奖
        } else {

            AchievementsBonuse.amount = rightPrice * 0.15//右区计奖
        }
        console.log('开始对比左区与右区的金额大小，并计算出总奖励金额')
        console.log('当前可能获取奖励的用户【', bonuseUser[0].id, '】获得的奖励金额为【', AchievementsBonuse.amount, '】')
        AchievementsBonuse.userId = bonuseUserIdGroup[index]
        console.log('查询当前可能获得奖励的用户【', bonuseUser[0].id, '】,今日已经获取的市场奖励金额')
        let r = await mongodb.find('achievement', { userId: bonuseUserIdGroup[index], project: '市场奖' })
        console.log('查询当前可能获得奖励的用户是否今日是否获得过市场奖励')
        let isToday = null
        r.map((item) => {
            if (moment(item.createdAt).isAfter(moment(data).startOf('day'))) {
                isToday = item
            } else {
                isToday = null
            }
        })
        if (isToday != null) {
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】已经获得过市场奖励,已获得的奖励是【', isToday.amount, '】')
            let todayBonuses = isToday.amount + AchievementsBonuse.amount - isToday.surplus
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】')
            console.log('判断今日获得奖励是否大于5000')
            if (todayBonuses > 5000) {
                AchievementsBonuse.amount = 5000, AchievementsBonuse.surplus = todayBonuses - 5000
                console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】大于5000，根据规则，其今日可获得奖励为【5000】')
            } else {
                AchievementsBonuse.amount = todayBonuses
                console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】大于5000，根据规则，其今日可获得奖励为【', todayBonuses, '】')
            }
            isToday.amount = AchievementsBonuse.amount; isToday.createdAt = moment(date).valueOf()
            await mongodb.update('achievement', { _id: ObjectId(r[0]._id) }, { $set: isToday })

        } else {
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日第一次获得市场奖，奖金为【', AchievementsBonuse.amount, '】')
            await mongodb.insert('achievement', AchievementsBonuse)
        }
        //计算领导奖励
        let leaderLevel1Bonuse = AchievementsBonuse.amount * 0.50
        let leaderLevel2Bonuse = AchievementsBonuse.amount * 0.20
        let leaderLevel3Bonuse = AchievementsBonuse.amount * 0.10
        let leader = bonuseUser[0].recommendIndex.reverse()
        let leaderBonuse = { userId: '', project: '领导奖', type: 'IN', amount: 0, createdAt: moment(date).valueOf(), remark: '领导奖' }
        console.log('开始计算领导奖')
        if (leader[1]) {
            console.log(`【${leader[1].id}】获得领导奖【${leaderLevel1Bonuse}】`)
            leaderBonuse.userId = leader[1].userId
            leaderBonuse.amount = leaderLevel1Bonuse
            await mongodb.insert('achievement', leaderBonuse)
        }
        if (leader[2]) {
            console.log(`【${leader[2].id}】获得领导奖【${leaderLevel2Bonuse}】`)
            leaderBonuse.userId = leader[2].userId
            leaderBonuse.amount = leaderLevel2Bonuse
            await mongodb.insert('achievement', leaderBonuse)
        }
        if (leader[3]) {
            console.log(`【${leader[3].id}】获得领导奖【${leaderLevel3Bonuse}】`)
            leaderBonuse.userId = leader[3].userId
            leaderBonuse.amount = leaderLevel3Bonuse
            await mongodb.insert('achievement', leaderBonuse)
        }

    }

}


module.exports = router