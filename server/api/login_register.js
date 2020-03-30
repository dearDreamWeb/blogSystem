module.exports = (router, crud) => {

    // 用户登录  并 给session传值
    router.get("/login", (req, res) => {
        crud("SELECT * FROM `users` WHERE user_name=? AND user_password=?",
            [req.query.userName, req.query.userPassword], data => {
                if (data.length > 0) {
                    req.session = {};
                    req.session.userInfo = data[0];
                    res.json({ status: 0 });
                } else {
                    res.json({ status: 1 });
                }
            })
    });

    // 用户注册
    router.get("/register", (req, res) => {
        let jsonDatas = JSON.parse(req.query.ruleForm);
        // 引入随机id值
        let randomId = require("../randomId")();
        let objDatas = {
            user_id: randomId,
            user_name: jsonDatas.name,
            user_password: jsonDatas.password,
            user_sex: jsonDatas.sex,
            user_avatar: jsonDatas.imageUrl,
            user_email: jsonDatas.email,
            user_birthday: jsonDatas.birthday,
            user_address: jsonDatas.address.join(""),
            user_nickName: jsonDatas.nickName
        }
        crud("SELECT * FROM `users` WHERE user_name =?", [jsonDatas.name], data => {
            // 判断用户名是否已被注册，若已注册，返回{status:1}
            if (data.length > 0) {
                res.json({ status: 1 })
            } else {
                // 用户名未被注册，插入数据
                crud("INSERT INTO `users` SET ?", objDatas, data => {
                    res.json({ status: 0 });
                })
            }
        })

    });

    // 头像传入upload/avatar文件夹中
    const multer = require("multer");
    const upload = multer({ dest: "./../upload/avatar" }).single("file");
    router.post("/upload", upload, (req, res) => {
        let imgUrl = `http://localhost:3000/${req.file.filename}`;
        res.json({
            status: 0,
            imgUrl
        });
    });
}