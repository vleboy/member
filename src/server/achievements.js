const _ = require('lodash')
const moment = require('dayjs');
const ObjectId = require('mongodb').ObjectID


//更新用户状态
async function updateUser(inparam, date) {
    console.log(`开始激活当前用户【${inparam.people[0].id}】`)
    console.log(`当前用户【${inparam.people[0].id}】激活套餐价格为${inparam.price}`)
 
        await mongodb.update('user', { id: inparam.people[0].id}, { $set: { status: 'normal', activateAt: moment(date).valueOf(), price: inparam.price } })
        if(inparam.price != 0 ){
            await mongodb.insert('bill',{type:'IN',amount:inparam.price,userId:inparam.people[0].id,project:'套餐',remark:'激活默认金额',id:'D'+_.random(000000,999999),createdAt:Date.now(),balance:2980})
           // await mongodb.insert('bill',{type:'OUT',amount:inparam.price,userId:inparam.people[0].id,project:'套餐',remark:'购买套餐',id:'D'+_.random(000000,999999),createdAt:Date.now(),balance:0})
        }
        console.log(`当前用户【${inparam.people[0].id}】已激活`)
 
}

//推荐奖与回本奖
//规则1.以安置位置来算，若旗下有一名非0点位成员，获得该成员点位金额的20%
//规则2.以安置位置来算，若旗下有两名非0点位成员，获得该成员点位金额的100%
//规则3.以安置点位来算, 若旗下有一名0点位成员，获得其中非0点位成员点位金额的20%
async function getReferralBonuses(inparam, date) {
    // inparam.id          //当前激活用户
    // inparam.initPrice   //当前激活选择的用户的套餐价格

    console.log('开始计算推荐奖')
    if (inparam.people.length > 0 && inparam.people[0].id != 'root') {
        //通过当前用户的安置信息


        if (inparam.father[0].referralBonuses.status == 'null') {
            //第一阶段奖励


            //更新状态
            let o = _.cloneDeep(inparam.father[0].referralBonuses)
            //  console.log('1', o)
            if (o.phase2.id == inparam.people[0].id) {
                o.phase1 = inparam.father[0].referralBonuses.phase2
                o.phase2 = inparam.father[0].referralBonuses.phase1

            }
            // console.log('2', o)
            o.status = 'phase1'; o.phase1.id = inparam.people[0].id; o.phase1.price = inparam.initPrice * 0.2
            // console.log('3', o)
            console.log(`用户【${inparam.father[0].id}】获得第一阶段推荐奖`)
            console.log(`用户【${inparam.father[0].id}】第一阶段的推荐奖奖金系数为0.2`)
            console.log(`用户${inparam.father[0].id}获得第一阶段推荐奖，奖金为${o.phase1.price}`)

            await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
            await mongodb.insert('achievement', { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第一阶段' })
            return { userId: inparam.father[0].id, project: '推荐奖', type: 'IN', amount: Math.abs(inparam.initPrice * 0.2), createdAt: moment(date).valueOf(), remark: '第一阶段' }
        } else if (inparam.father[0].referralBonuses.status == 'phase1' && inparam.father[0].referralBonuses.phase1.id != inparam.people[0].id) {
            //判断phase1是否为0套餐
            console.log(`用户【${inparam.father[0].id}】获得第二阶段推荐奖`)
            console.log(`开始判断用户【${inparam.father[0].id}】第一阶段的推荐奖奖金是否为0`)
            if (inparam.father[0].referralBonuses.phase1.price != 0) {
                console.log(`用户【${inparam.father[0].id}】第一阶段的推荐奖奖金为【${inparam.father[0].referralBonuses.phase1.price}】`)
                console.log(`用户【${inparam.father[0].id}】第二阶段的推荐奖奖金系数为0.8`)
                let o = inparam.father[0].referralBonuses
                o.status = 'phase2'; o.phase2.id = inparam.people[0].id; o.phase2.price = inparam.initPrice * 0.8
                console.log(`用户${inparam.father[0].id}获得第二阶段推荐奖，奖金为${o.phase2.price}`)
                await mongodb.update('user', { _id: ObjectId(inparam.father[0]._id) }, { $set: { referralBonuses: o } })
            } else {
                console.log(`用户【${inparam.father[0].id}】第一阶段的推荐奖奖金为0`)
                console.log(`用户【${inparam.father[0].id}】第二阶段的推荐奖奖金系数为0.2`)
                let o = inparam.father[0].referralBonuses
                o.status = 'phase2'; o.phase2.id = inparam.people[0].id; o.phase2.price = inparam.initPrice * 0.2
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

    let achievementsBonuse = { userId: '', project: '市场奖', type: 'IN', amount: 0,achievements:0, createdAt: moment(date).valueOf(), market: null, surplus: 0 }


    //如果当前当前状态变更的用户，位置等级小于3,则不会出现市场奖
    if (inparam.people[0].levelIndex.length < 3) {
        console.log(`当前用户【${inparam.people[0].id}】层级长度为【`, inparam.people[0].levelIndex.length, '】不会出现市场奖励')
        return
    }
    console.log(`当前用户【${inparam.people[0].id}】层级长度为【${inparam.people[0].levelIndex.length}】, 可能会出现市场奖励'`)
    //获取当前可能需要返奖的用户
    let bonuseUserIdGroup = inparam.people[0].levelIndex.reverse()
    let nowPeopleLevelIndex = _.cloneDeep(bonuseUserIdGroup)
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
        let left = []; let right = []; let leftName = []; let rightName = []; let leftMarket = null; let rightMarket = null;
        activeBonuses.map((item) => {
            if (item.id != bonuseUserIdGroup[index]) {
                if (item.status == 'normal') {

                    if (item.levelIndex.indexOf(nowPeopleLevelIndex[index + 1]) != -1) {
                        right.push(item)
                        rightName.push(item.username)
                        
                    } else {
                        left.push(item)
                        leftName.push(item.username)
                      
                    }
                }
            }
        })
        console.log(`当前可能获取奖励的用户【${bonuseUserIdGroup[index]}】其有效奖励点位左区为:【${leftName}】,右区为:【${rightName}】`)
        //处理奖励逻辑
        let leftPrice = 0; let rightPrice = 0;
        let bonuseUser = await mongodb.find('user', { id: bonuseUserIdGroup[index] })
        console.log('开始为当前可能获取奖励的用户【', bonuseUser[0].id, '】寻找匹配分区')
        //计算左区金额
        // left.map((item) => {
        //     if (item.id != bonuseUser[0].referralBonuses.phase1.id && item.id != bonuseUser[0].referralBonuses.phase2.id) {
        //         leftPrice = item.initPrice + leftPrice
        //         // console.log('leftPrice', leftPrice)
        //     }
        // })
        console.log('left',left);console.log('right',right);console.log('ref',bonuseUser[0].referralBonuses)
        if (left.length > 0){
            left.map((item) => {
                if (item.id == bonuseUser[0].referralBonuses.phase1.id) {
                    leftMarket = bonuseUser[0].referralBonuses.phase1.id
                    rightMarket = bonuseUser[0].referralBonuses.phase2.id
                    console.log(`市场${leftMarket}为左区`)
                    console.log(`市场${rightMarket}为右区`)
                } else if (item.id == bonuseUser[0].referralBonuses.phase2.id) {
                    leftMarket = bonuseUser[0].referralBonuses.phase2.id
                    rightMarket = bonuseUser[0].referralBonuses.phase1.id
                    console.log(`市场${rightMarket}为右区`)
                    console.log(`市场${leftMarket}为左区`)
                }
            })
    
          
        }else if(left.length == 0){
            right.map(item=>{
                if (item.id == bonuseUser[0].referralBonuses.phase1.id) {
                    rightMarket = bonuseUser[0].referralBonuses.phase1.id
                     leftMarket  = bonuseUser[0].referralBonuses.phase2.id
                    console.log(`市场${leftMarket}为左区`)
                    console.log(`市场${rightMarket}为右区`)
                } else if (item.id == bonuseUser[0].referralBonuses.phase2.id) {
                    rightMarket  = bonuseUser[0].referralBonuses.phase2.id
                    leftMarket = bonuseUser[0].referralBonuses.phase1.id
                    console.log(`市场${rightMarket}为右区`)
                    console.log(`市场${leftMarket}为左区`)
                }
            })
        }
    
        left.map((item) => {
            if (item.id != bonuseUser[0].referralBonuses.phase1.id && item.id != bonuseUser[0].referralBonuses.phase2.id) {
                leftPrice = item.initPrice + leftPrice
                console.log('leftPrice', leftPrice)
            }
        })
        console.log('开始计算当前可能获取奖励的用户【', bonuseUser[0].id, '】的左区金额')
        console.log('左区【', leftMarket, '】市场的金额统计完毕，为【', leftPrice, '】')

        //计算右区金额
        right.map((item) => {
            if (item.id != bonuseUser[0].referralBonuses.phase1.id && item.id != bonuseUser[0].referralBonuses.phase2.id) {
                rightPrice = item.initPrice + rightPrice
                console.log('rightPrice', rightPrice)
            }
        })
        console.log('开始计算当前可能获取奖励的用户【', bonuseUser[0].id, '】的右区金额')
        console.log('右区【', rightMarket, '】市场的金额统计完毕，为【', rightPrice, '】')
        console.log('开始对比左区与右区的金额大小，并计算出总奖励金额')
        if (leftPrice <= rightPrice) {

            achievementsBonuse.amount = leftPrice * 0.15//左区计奖
        } else {
            achievementsBonuse.amount = rightPrice * 0.15//右区计奖
        }
        console.log('当前可能获取奖励的用户【', bonuseUser[0].id, '】获得的奖励金额为【', achievementsBonuse.amount, '】')
        achievementsBonuse.userId = bonuseUserIdGroup[index]
        console.log('查询当前可能获得奖励的用户【', bonuseUser[0].id, '】,今日已经获取的市场奖励金额')
        let r = await mongodb.find('achievement', { userId: bonuseUserIdGroup[index], project: '市场奖' })
        console.log('查询当前可能获得奖励的用户是否今日是否获得过市场奖励')
        let isLeftToday = null
        let isRightToday = null
        let isToday = null
        let leftSubplus = 0
        let rightSurplus = 0
        let subLeftAmount = 0
        let subRightAmount = 0
        let subSurplus = 0
        let subAmount = 0
        // r.map((item) => {
        //     if (moment(item.createdAt).isAfter(moment(date).startOf('day'))) {
        //         isToday = item
        //     } else {
        //         subAmount += item.amount
        //         subSurplus += item.surplus
        //     }
        // })
        r.map((item) => {
            if (moment(item.createdAt).isAfter(moment(date).startOf('day').valueOf())) {
                if (item.market == leftMarket) {
                    isLeftToday = _.cloneDeep(item)  //左区市场
                } else if (item.market == rightMarket) {
                    isRightToday = _.cloneDeep(item)//右区市场
                }
                // isToday = item
            } else {
                if (item.market == leftMarket) {
                    leftSubplus += item.surplus
                    subLeftAmount += item.amount
                } else if (item.market == rightMarket) {
                    rightSurplus += item.surplus
                    subRightAmount += item.amount
                }

                // subAmount += item.amount
                // subSurplus += item.surplus
            }
        })
        subAmount = subLeftAmount + subRightAmount
        subSurplus = leftSubplus + rightSurplus
        //当前用户当天获得的奖励是=计算总金额-今日之前总金额-今日之前总surplus
        let todayBonuses = achievementsBonuse.amount - subAmount - subSurplus
        let leftTodayBonuses = achievementsBonuse.amount - subAmount - subSurplus - subRightAmount
        let rightTodayBonuses = achievementsBonuse.amount - subAmount - subSurplus - subLeftAmount
        // if (isToday != null) {
        //     console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日已经获得过市场奖励,已获得的奖励是【', isToday.amount, '】')
        //     console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】')
        //     console.log('判断今日获得奖励是否大于5000')
        //     if (todayBonuses > 5000) {
        //         achievementsBonuse.amount = 5000, achievementsBonuse.surplus = todayBonuses - 5000
        //         console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】大于5000，根据规则，其今日可获得奖励为【5000】')
        //     } else {
        //         achievementsBonuse.amount = todayBonuses
        //         console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】小于或者等于5000，根据规则，其今日可获得奖励为【', todayBonuses, '】')
        //     }
        //     isToday.amount = achievementsBonuse.amount; isToday.createdAt = moment(date).valueOf()

        //     await mongodb.update('achievement', { _id: ObjectId(bonuseUser[0]._id) }, { $set: isToday })

        // } else {
        //     achievementsBonuse.amount = todayBonuses
        //     console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日第一次获得市场奖，奖金为【', achievementsBonuse.amount, '】')
        //     await mongodb.insert('achievement', achievementsBonuse)
        // }
        if (isLeftToday != null) {
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日【', leftMarket, '】市场已经获得过市场奖励,已获得的奖励是【', isLeftToday.amount, '】')
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日【', leftMarket, '】市场应该获得的奖励为【', leftTodayBonuses, '】')
            console.log('判断今日获得奖励是否大于5000')
            if (todayBonuses > 5000) {
                achievementsBonuse.amount = 5000, achievementsBonuse.surplus = todayBonuses - 5000
                console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】大于5000，根据规则，其今日可获得奖励为【5000】')
            } else {
                achievementsBonuse.amount = todayBonuses
                console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】小于或者等于5000，根据规则，其今日可获得奖励为【', todayBonuses, '】')
            }
            isLeftToday.amount = achievementsBonuse.amount; isLeftToday.createdAt = moment(date).valueOf();isLeftToday.achievements = leftPrice
            let now_id = isLeftToday._id
            console.log('no03',now_id)
            delete isLeftToday._id
           
            await mongodb.update('achievement', { _id: ObjectId(now_id) }, { $set: isLeftToday })
            await mongodb.update('achievement', { market: rightMarket}, { $set: {achievements :rightPrice} })
        } else if (isRightToday != null) {
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日【', rightMarket, '】市场已经获得过市场奖励,已获得的奖励是【', isRightToday.amount, '】')
            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日【', rightMarket, '】市场应该获得的奖励为【', rightTodayBonuses, '】')
            console.log('判断今日获得奖励是否大于5000')
            if (todayBonuses > 5000) {
                achievementsBonuse.amount = 5000, achievementsBonuse.surplus = todayBonuses - 5000
                console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】大于5000，根据规则，其今日可获得奖励为【5000】')
            } else {
                achievementsBonuse.amount = todayBonuses
                console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日获得的奖励为【', todayBonuses, '】小于或者等于5000，根据规则，其今日可获得奖励为【', todayBonuses, '】')
            }
            isRightToday.amount = achievementsBonuse.amount; isRightToday.createdAt = moment(date).valueOf();isRightToday.achievements = rightPrice
            let now_id = isRightToday._id
            delete isRightToday._id
            console.log('no04',isRightToday)
            await mongodb.update('achievement', { _id: ObjectId(now_id)}, { $set: isRightToday })
            await mongodb.update('achievement', { market: leftMarket}, { $set: {achievements :leftPrice} })
        } else {

            console.log('当前可能获得奖励的用户【', bonuseUser[0].id, '】今日第一次获得市场奖，奖金为【', achievementsBonuse.amount, '】') //左区

            //leftMarket 业绩
            achievementsBonuse.amount = 0
            achievementsBonuse.market = leftMarket
            achievementsBonuse.achievements = leftPrice
            console.log('leftMarket01',achievementsBonuse)
            //rightMarket 业绩
            await mongodb.insert('achievement', achievementsBonuse)
            delete achievementsBonuse._id
            achievementsBonuse.amount = 0
            achievementsBonuse.market = rightMarket
            achievementsBonuse.achievements = rightPrice
            console.log('rightMarket02',achievementsBonuse)
            await mongodb.insert('achievement', achievementsBonuse)
        }
        //计算领导奖励
        let leaderLevel1Bonuse = achievementsBonuse.amount * 0.50
        let leaderLevel2Bonuse = achievementsBonuse.amount * 0.20
        let leaderLevel3Bonuse = achievementsBonuse.amount * 0.10
        let leader = bonuseUser[0].recommendIndex.reverse()
        let leaderBonuse = { userId: '', project: '领导奖', type: 'IN', amount: 0, createdAt: moment(date).valueOf(), remark: '领导奖' }
        console.log('开始计算领导奖',leader)
        if (leader[1]) {
            console.log(`【${leader[1]}】获得领导奖【${leaderLevel1Bonuse}】`)
            let le = _.cloneDeep(leaderBonuse)
            le.userId = leader[1]
            le.amount = leaderLevel1Bonuse
            await mongodb.insert('achievement', le)
        }
        if (leader[2]) {
            console.log(`【${leader[2]}】获得领导奖【${leaderLevel2Bonuse}】`)
            let le = _.cloneDeep(leaderBonuse)
            le.userId = leader[2]
            le.amount = leaderLevel2Bonuse
           await mongodb.insert('achievement', le)
        }
        if (leader[3]) {
            console.log(`【${leader[3]}】获得领导奖【${leaderLevel3Bonuse}】`)
            let le = _.cloneDeep(leaderBonuse)
            le.userId = leader[3]
            le.amount = leaderLevel3Bonuse
            await mongodb.insert('achievement', le)
        }

    }

}

module.exports = {
    updateUser, getReferralBonuses, getMarketBonuses

}