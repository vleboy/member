function check(inparam) {
    const error = {
        err: true,
        res: null
    }
    const {
        username,
        idnumber,
        mobile,
        wechatnumber,
        bankname,
        banknumber,
        password,
        level,
        address,
        parentId,
        recommendnumber,
        deliveryName,
        deliveryMobile,
        deliveryAddress,
    } = inparam

    if (!username || username.length < 2 || username.length > 8) {
        error.res = '名字2-8个字'
    } else if (!idnumber || (idnumber.length != '513101198703180011'.length)) {
        error.res = '证件号码为空或输入不合法'
    } else if (!mobile || (mobile.length != '13060080001'.length)) {
        error.res = '手机号为空或输入不合法'
    }
    else if (bankname) {
        if (!banknumber || banknumber.length > 10) error.res = '请输入正确的银行卡号'
    } else if (!password || (password.length < 6 || password.length > 18)) {
        error.res = '密码设置不合法'
    } else if (!level) {
        error.res = '请设置用户级别'
    } else if (!address) {
        error.res = '请设置用户地址'
    } else if (!address) {
        error.res = '请设置用户地址'
    }
    else if (!parentId) {
        error.res = '请设置用户安置编号'
    }
    else if (!recommendnumber) {
        error.res = '请设置推荐编号'
    }
    else if (deliveryName) {
        if (!deliveryMobile || deliveryMobile.length > 11) {
            error.res = '请输入正确的收货人电话'
        }
        if (!deliveryAddress || deliveryAddress > 3) {
            error.res = '请输入正确的收货人地址'
        }
    }
    if (error.res) {
        throw error
    }

}

module.exports = check