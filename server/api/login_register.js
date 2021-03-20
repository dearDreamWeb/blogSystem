module.exports = (router, crud) => {

    // 用户登录  并 给session传值
    router.get("/login", (req, res) => {
        crud("SELECT * FROM `users` WHERE user_name=? AND user_password=?",
            [req.query.userName, req.query.userPassword], data => {
                if (data.length > 0) {
                    if (data[0].user_isFreeze === 0) {
                        let uuid = require("../randomId")() + require("../randomId")();
                        res.cookie('uuid', uuid, { maxAge: 1000 * 60 * 60 * 24 * 7 }); //向前端种一个cookie，存放时间是7天
                        crud("INSERT INTO `user_uuid` SET?", { uuid, user_id: data[0].user_id }); // 向数据库中存入用户登录的uuid

                        let obj = { ...data[0] };
                        delete obj.user_password;
                        // 获取未读消息数量
                        crud("SELECT count(is_read) FROM `messages` WHERE to_id =? AND state=? AND is_read=?", [obj.user_id, 0, 0], messageData => {
                            obj.unReadCount = messageData[0]['count(is_read)'];
                            req.session.userInfo = obj;
                            res.json({ status: 0, user_id: obj.user_id });
                        })

                    } else {
                        // 代表该账号已冻结
                        res.json({
                            status: 2,
                        })
                    }

                } else {
                    res.json({ status: 1 });
                }
            })
    });

    // 用户注册
    router.get("/register", (req, res) => {
        let jsonDatas = JSON.parse(req.query.ruleForm);
        const moment = require("moment"); //格式化时间工具
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
            user_nickName: jsonDatas.nickName,
            user_createdTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        crud("SELECT * FROM `users` WHERE user_name =? OR user_nickName =?", [objDatas.user_name, objDatas.user_nickName], data => {
            // 判断用户名是否已被注册，若已注册，返回{state:1}
            if (data.length > 0) {
                let errorArr = [];
                crud("SELECT * FROM `users` WHERE user_name =?", [objDatas.user_name], data1 => {
                    if (data1.length > 0) {
                        errorArr[0] = "用户已存在";
                    }
                    crud("SELECT * FROM `users` WHERE user_nickName =?", [objDatas.user_nickName], data2 => {
                        if (data2.length > 0) {
                            errorArr[1] = "昵称已存在";
                        }
                        res.json({ status: 1, errorArr })
                    })
                })

            } else {
                // 用户名未被注册，插入数据
                crud("INSERT INTO `users` SET ?", objDatas, () => {
                    res.json({ status: 0 });
                })
            }
        })

    });

    // 头像传入upload/avatar文件夹中
    const multer = require("multer");
    const upload = multer({ dest: "../upload/avatar" }).single("file");
    router.post("/upload", upload, (req, res) => {
        let imgUrl = `http://localhost:3000/${req.file.filename}`;
        res.json({
            state: 0,
            imgUrl
        });
    });


    /** 
     * 获取用户信息
     * state:0代表用户存在
     * state:1代表用户不存在
     * */
    router.get("/getUserInfo", (req, res) => {
        if (req.session && req.session.userInfo) {
            const { user_id } = req.session.userInfo;
            // 获取未读消息数量
            crud("SELECT count(is_read) FROM `messages` WHERE to_id =? AND state=? AND is_read=?", [user_id, 0, 0], messageData => {
                let obj = { ...req.session.userInfo };
                obj.unReadCount = messageData[0]['count(is_read)'];
                req.session.userInfo = { ...obj };
                res.json({
                    state: 0,
                    userInfo: obj
                })
            })
        } else {
            res.json({
                state: 1,
                errCode: 0
            });
        }
    })

    /** 
     * 获取用户信息
     * state:0代表用户存在
     * state:1代表用户不存在
     * */
    router.get("/getUserAbout", (req, res) => {
        const { user_id } = req.query;
        crud("SELECT * FROM `users` WHERE user_id=?", [user_id], data => {
            if (data.length > 0) {
                let dataObj = { ...data[0] };
                delete dataObj.user_password;
                res.json({
                    state: 0,
                    userInfo: dataObj
                })
            } else {
                res.json({ state: 1 });
            }
        })
    })

    // 注销
    router.get("/loginOut", (req, res) => {
        //注销session
        req.session.userInfo = null;
        res.json({ state: 0 });
    })

    /**
     * 修改用户信息
    */
    router.post("/updateUserData", (req, res) => {
        let data = req.body.data;
        let arrData = [data.user_password, data.user_sex, data.user_nickName, data.user_avatar, data.user_email, data.user_birthday, data.user_address, data.user_id];
        crud("UPDATE `users` SET user_password=?, user_sex=?, user_nickName=?, user_avatar=?, user_email=?, user_birthday=?, user_address=? WHERE user_id =?",
            arrData, () => {
                res.json({ state: 0 });
            })
    })

    /**
     * 判断用户是否登录
     */
    router.get("/userIsLogin", (req, res) => {
        if (req.session.userInfo) {
            res.json({
                status: 0
            })
        } else {
            res.json({
                status: 1,
                errCode: 0
            })
        }
    })
}