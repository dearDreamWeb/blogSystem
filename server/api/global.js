module.exports = (router, crud) => {

    /**
     * 通过获取前端的cookie中的uuid和数据库中该用户最早的uuid进行对比，
     * 如果不一样，将session中的用户信息清空
     */
    router.use('', (req, res, next) => {
        // 获取前端的cookie，然后切割成对象的形式
        res.header("Content-Type", "application/json; charset=utf-8");
        let cookies = req.headers.cookie;
        let uuid = handleCookies(cookies);
        if (req.session.userInfo && uuid) {
            const { user_id } = req.session.userInfo;
            // 查询该用户在数据库中的uuid
            crud("SELECT * FROM `user_uuid` WHERE user_id=? ORDER BY created_time DESC", [user_id], data => {
                if (data.length > 0) {
                    let lasterUuid = data[0].uuid;
                    if (uuid !== lasterUuid) {
                        req.session.userInfo = null;
                    }
                } else {
                    req.session.userInfo = null;
                }
            })
        } else {
            req.session.userInfo = null;
        }
        next();
    })

    // 处理前端获取的cookies，并返回前端cookie中的uuid
    const handleCookies = (cookies) => {
        let arr = cookies.split(";")
        let cookiesObj = {}; //对象形式的cookie
        arr.forEach(item => {
            let objArr = item.split("=");
            cookiesObj[objArr[0].trim()] = objArr[1].trim()
        })
        return cookiesObj.uuid;
    }
}