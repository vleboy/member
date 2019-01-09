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

    if (!(type || amount || userId)) {
        error.res = '请输入正确的参数'
    }
    amount = parseFloat(amount)
    if (error.res) {
        throw error
    }
}

module.exports = check