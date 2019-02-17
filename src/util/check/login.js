function check(inparam) {
    const error = {
        err: true,
        res: null
    }
    const {
        id,
        mobile,
        password,
        from
    } = inparam
    let myDate = new Date()
    if ((myDate.getHours() == 0 && myDate.getMinutes() < 5) || (myDate.getHours() == 23 && myDate.getMinutes() > 57)) {
        error.res = '当前为系统结算时间，请稍等再试' }
    if(from == 'admin'){
        if(id != 'root'){
            error.res = '不允许非管理员登录'
        }
    }
    if (!id && !mobile) {
        error.res = '请输入用户id或电话号码'
    } else if (!password || password.length > 18) {
        error.res = '用户密码错误'
    }
    if (error.res) {
        throw error
    }
}

module.exports = check