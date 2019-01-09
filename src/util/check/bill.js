function check(inparam) {
    const error = {
        err: true,
        res: null
    }
    //收货地址，收货人，收货电话
    const {
        userId,
        type,
        amount,
    } = inparam

    if (!(type || amount || userId)) {
        error.res = '请输入正确的参数'
    }
    if(typeof amount != 'number'){
        error.res = 'amout必须为number类型'
    }
    if (error.res) {
        throw error
    }
}

module.exports = check