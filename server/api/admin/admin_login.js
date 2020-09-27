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
            let { username, category } = req.session.adminInfo;
            res.json({
                status: 0,
                adminUsername: username,
                category: category === 1 ? true : false  // 为1是超级管理员，返回true
            })
        } else {
            res.json({
                status: 1,
                mess: "管理员未登录，请先登录"
            })
        }
    })

    // 退出登录
    router.get("/admin/loginOut", (req, res) => {
        //注销session
        req.session.adminInfo = null;
        res.json({ status: 0 });
    })

    // 后台管理主页的信息
    router.get("/admin/homeData", (req, res) => {
        let objData = {
            users: {
                all: 0,
                man: 0,
                woman: 0
            }, //用户量
            views: 0, // 用户访问量
            yearNewUsers: {}, // 近一年新用户注册量的信息
            supports: 0, // 文章点赞量
            comments: 0, //  文章评论量
            ageCategoires: [], //年龄分组，对应["00后", "90后", "80后", "70后", "60后", "60前"]
        }

        // 通过post表来累加supports、views、comments数据
        crud("SELECT * FROM `post`", [], data => {
            data.forEach(item => {
                objData.views += item.post_read_count;
                objData.supports += item.post_praise_count;
                objData.comments += item.post_comment_count;
            })
        })

        // 通过users表来累加users、yearNewUsers、ageCategoires数据
        crud("SELECT * FROM `users`", [], data => {
            objData.users.all = data.length;
            getYearNewUsers(data);
            getAgeCategories(data);
            res.json({
                status: 0,
                data: objData
            })
        })

        //  处理数据得到近一年新用户注册量的数据 
        function getYearNewUsers(data) {
            let nowMonth = new Date().getMonth() + 1;  // 现在的月份，比真实的月份少一
            let nowYear = new Date().getFullYear();  // 现在的年份
            let months = {}; // 近一年的月数据
            // 获取从本月向前12个月的年月数据
            for (let i = 12; i > 0; i--) {
                if (nowMonth - i > 0) {
                    months[`${nowYear}-${nowMonth - i + 1}`] = 0;
                } else {
                    months[`${nowYear - 1}-${nowMonth - i + 12}`] = 0;
                }
            }

            // 按照文章发布的年月来进行数量的计算
            data.forEach(item => {
                let createdTimeYear = new Date(item.user_createdTime).getFullYear();  // 文章发布的年份
                let createdTimeMonth = new Date(item.user_createdTime).getMonth() + 1; // 文章发布的月份
                if (item.user_sex === 1) {
                    objData.users.man++;
                } else {
                    objData.users.woman++;
                }
                for (const key in months) {
                    let _itemYear = new Date(key).getFullYear(); // months中的年份
                    let _itemMonth = new Date(key).getMonth() + 1; // months中的月份
                    if (_itemYear === createdTimeYear && _itemMonth === createdTimeMonth) {
                        months[key]++;
                    }
                }
            })

            objData.yearNewUsers = months;
        }

        // 获取年龄分组情况，按照["00后", "90后", "80后", "70后", "60后", "60前"]分组
        function getAgeCategories(data) {
            let obj = {}
            let arrYear = [2000, 1990, 1980, 1970, 1960, 0];
            arrYear.forEach(item => {
                obj[item] = 0;
            });

            data.forEach(item => {
                let year = new Date(item.user_birthday).getFullYear();
                for (let i = 0; i < arrYear.length; i++) {
                    return fn(arrYear[i], i, year);
                }
            })

            // 递归得到年龄分组
            function fn(_item, _index, year) {
                if (_item > year) {
                    fn(arrYear[_index + 1], _index + 1, year)
                } else {
                    obj[_item]++;
                    return false;
                }
            }
            objData.ageCategoires = Object.values(obj).reverse();
        }
    })
}