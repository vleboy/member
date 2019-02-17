function check(inparam) {
    const error = {
        err: true,
        res: null
    }
    const {
        name,
        desc,
        img,
        price,
        activity,
    } = inparam
    let myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        error.res = '当前为系统结算时间，请稍等再试' }
    
    if (!name || name.length < 2 || name.length > 18) {
        error.res = '名字2-8个字'
    } else if (!img) {
        error.res = '产品图片不能为空'
    }
    else if (!price || price <= 0 || price > 100000000000) {
        error.res = '产品价格必须在0 - 100000000000 之间'
    }
    if (error.res) {
        throw error
    }

}

module.exports = check