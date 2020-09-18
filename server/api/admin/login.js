module.exports = (router, crud) => {
    // 管理登录
    router.post("/admin_login", (req, res) => {
        crud("SELECT * FROM `admin_users` WHERE `username`=? AND `password` = ?",
            [req.body.username, req.body.password], data => {
                if (data.length > 0) {
                    req.session.adminInfo = data[0];
                    res.json({
                        status: 0,
                        adminUsername: req.body.username,
                        message: "管理员登录成功"
                    })
                } else {
                    res.json({
                        status: 1,
                        message: "用户名或密码错误"
                    })
                }

            })
    })

    // 判断管理员是否登录
    router.get("/admin/isLogin", (req, res) => {
        if (req.session.adminInfo) {
            let { username } = req.session.adminInfo;
            res.json({
                status: 0,
                adminUsername: username
            })
        } else {
            res.json({
                status: 1,
                mess: "管理员未登录，请先登录"
            })
        }
    })
}