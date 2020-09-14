module.exports = (router, crud) => {
    router.post("/admin_login", (req, res) => {
        crud("SELECT * FROM `admin_users` WHERE `username`=? AND `password` = ?",
            [req.body.username, req.body.password], data => {
                if (data.length > 0) {
                    req.session.adminInfo = data[0];
                    res.json({
                        status: 0,
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
}