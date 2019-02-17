function check(inparam) {
    
    const error = {
        err: true,
        res: null
    }
    //收货地址，收货人，收货电话
    let {
        userId,
        type,
        amount,
    } = inparam
    let myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        error.res = '当前为系统结算时间，请稍等再试' }
    
    if (!type || !amount || !userId) {
        error.res = '请输入正确的参数'
    }
    amount = parseFloat(amount)
    if (error.res) {
        throw error
    }
}

module.exports = check