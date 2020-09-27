module.exports = (router, crud) => {
    /**
     * 获取用户
     * status 用户的状态 0为正常用户；1为冻结用户；2为全部用户
     */
    router.get("/admin/usersLists", (req, res) => {
        let sort_orderBy = req.query.sort_orderBy === "1" ? "ASC" : "DESC";
        let {
            status,   // 用户的状态 0为正常用户；1为冻结用户；2为全部用户
            dateVal,  // 日期范围
            keyWord,       // 搜索的关键字
            currentPage,   // 当前页数
            pageSize        // 每页多少条数据
        } = req.query;
        let currentIndex = (currentPage - 1) * pageSize; // 开始索引的值

        // 判断dateVal是否为空数组，有值代表有时间范围，格式化一下即可;没有值代表没有时间范围，给其添加时间范围
        if (dateVal.length > 0) {
            dateVal = dateVal.map(item => {
                return new Date(item).toLocaleDateString();
            })
        } else {
            dateVal = ["1970/1/1", "3000/1/1"];
        }

        // 给status重新整理一下，为了查询语句用的是between 
        switch (status) {
            case "0":
                status = [0, 0];
                break;
            case "1":
                status = [1, 1];
                break;
            case "2":
                status = [0, 2];
                break;
            default:
                status = [0, 2];
                break;
        }

        // 有关键字的话，按照关键字搜索
        if (keyWord) {
            crud(`SELECT count(user_id) FROM ` + "`users`" + ` WHERE (user_createdTime BETWEEN ? AND ?) AND (user_isFreeze BETWEEN ? AND ?) AND (user_id =? OR user_nickName =?)`,
                [dateVal[0], dateVal[1], status[0], status[1], keyWord, keyWord], num => {
                    let total = num[0]["count(user_id)"];
                    crud(`SELECT * FROM ` + "`users`" + `WHERE (user_createdTime BETWEEN ? AND ?) AND (user_isFreeze BETWEEN ? AND ?) AND (user_id =? OR user_nickName =?) ORDER BY ` + "`user_createdTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`,
                        [dateVal[0], dateVal[1], status[0], status[1], keyWord, keyWord], data => {
                            data.forEach(item => {
                                item.user_password = ""
                            })
                            res.json({
                                status: 0,
                                allPost: data,
                                total
                            });
                        });
                })
        } else {
            crud(`SELECT count(user_id) FROM ` + "`users`" + ` WHERE (user_createdTime BETWEEN ? AND ?) AND (user_isFreeze BETWEEN ? AND ?) `,
                [dateVal[0], dateVal[1], status[0], status[1]], num => {
                    let total = num[0]["count(user_id)"];
                    crud(`SELECT * FROM ` + "`users`" + `WHERE (user_createdTime BETWEEN ? AND ?) AND (user_isFreeze BETWEEN ? AND ?) ORDER BY ` + "`user_createdTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`,
                        [dateVal[0], dateVal[1], status[0], status[1]], data => {
                            data.forEach(item => {
                                item.user_password = ""
                            })
                            res.json({
                                status: 0,
                                allPost: data,
                                total
                            });
                        });
                })
        }
    })

    /**
     * 改变用户的状态
     */
    router.get("/admin/changeIsFreeze", (req, res) => {
        let { user_id, newStatus } = req.query;
        crud("UPDATE `users` SET `user_isFreeze` = ? WHERE user_id =?", [newStatus, user_id], () => {
            res.json({
                status: 0
            })
        })
    })

    /**
     * 修改用户密码
     */
    router.post("/admin/editUserPass", (req, res) => {
        let { user_id, oldPass, newPass } = req.body;
        crud("SELECT user_password FROM `users` WHERE `user_id`=? ", [user_id], data => {
            if (data[0].user_password === oldPass) {
                crud("UPDATE `users` SET `user_password` = ? WHERE user_id =?", [newPass, user_id], () => {
                    res.json({
                        status: 0
                    })
                })
            } else {
                res.json({
                    status: 1,
                    mess: "旧密码错误"
                })
            }
        })

    })


    /**
     * 删除用户
     */
    router.delete("/admin/deleteUser", (req, res) => {
        let { user_id } = req.query;

        // 删除post表中的对应的数据
        crud(`DELETE FROM ` + "`post`" + ` WHERE post_masterId=?`, [user_id], () => {
            // 删除post_support表中的对应的数据
            crud(`DELETE FROM ` + "`post_support`" + ` WHERE user_id=?`, [user_id], () => {
                // 删除comment表中的对应的数据
                crud(`DELETE FROM ` + "`comment`" + ` WHERE comment_masterId=?`, [user_id], () => {
                    // 删除users表中的对应的数据
                    crud(`DELETE FROM ` + "`users`" + ` WHERE user_id=?`, [user_id], () => {
                        res.json({
                            status: 0,
                            mess: "删除成功"
                        })
                    })
                })
            })
        })
    })

    /**
     * 获取管理员用户
     * 
     */
    router.get("/admin/adminUsersLists", (req, res) => {
        let sort_orderBy = req.query.sort_orderBy === "1" ? "ASC" : "DESC";
        let {
            dateVal,  // 日期范围
            keyWord,       // 搜索的关键字
            currentPage,   // 当前页数
            pageSize        // 每页多少条数据
        } = req.query;
        let currentIndex = (currentPage - 1) * pageSize; // 开始索引的值

        // 判断dateVal是否为空数组，有值代表有时间范围，格式化一下即可;没有值代表没有时间范围，给其添加时间范围
        if (dateVal.length > 0) {
            dateVal = dateVal.map(item => {
                return new Date(item).toLocaleDateString();
            })
        } else {
            dateVal = ["1970/1/1", "3000/1/1"];
        }

        // 有关键字的话，按照关键字搜索
        if (keyWord) {
            crud(`SELECT count(id) FROM ` + "`admin_users`" + ` WHERE (created_time BETWEEN ? AND ?) AND (id =? OR username =?)`,
                [dateVal[0], dateVal[1], keyWord, keyWord], num => {
                    let total = num[0]["count(user_id)"];
                    crud(`SELECT * FROM ` + "`admin_users`" + `WHERE (created_time BETWEEN ? AND ?) AND (id =? OR username =?) ORDER BY ` + "`created_time`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`,
                        [dateVal[0], dateVal[1], keyWord, keyWord], data => {
                            data.forEach(item => {
                                item.user_password = ""
                            })
                            res.json({
                                status: 0,
                                allPost: data,
                                total
                            });
                        });
                })
        } else {
            crud(`SELECT count(id) FROM ` + "`admin_users`" + ` WHERE (created_time BETWEEN ? AND ?) `,
                [dateVal[0], dateVal[1]], num => {
                    let total = num[0]["count(id)"];
                    crud(`SELECT * FROM ` + "`admin_users`" + `WHERE (created_time BETWEEN ? AND ?)  ORDER BY ` + "`created_time`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`,
                        [dateVal[0], dateVal[1]], data => {
                            data.forEach(item => {
                                item.user_password = ""
                            })
                            res.json({
                                status: 0,
                                allPost: data,
                                total
                            });
                        });
                })
        }
    })

    /**
   * 修改管理员用户密码
   */
    router.post("/admin/changeAdminUserPass", (req, res) => {
        let { adminUser_id, oldPass, newPass } = req.body;
        crud("SELECT password FROM `admin_users` WHERE `id`=? ", [adminUser_id], data => {
            if (data[0].password === oldPass) {
                crud("UPDATE `admin_users` SET `password` = ? WHERE id =?", [newPass, adminUser_id], () => {
                    res.json({
                        status: 0,
                        mess: "修改密码成功"
                    })
                })
            } else {
                res.json({
                    status: 1,
                    mess: "旧密码错误"
                })
            }
        })

    })

    /**
     * 添加新的管理员
     */
    router.post("/admin/addAdminUser", (req, res) => {
        let moment = require("moment");
        let { username, password } = req.body;
        // 查询username看用户是否已存在
        crud("SELECT * FROM `admin_users` WHERE username=?", [username], data => {
            if (data.length > 0) {
                res.json({
                    status: 1,
                    mess: "该用户已存在"
                })
            } else {
                // 添加管理员的数据
                let insertData = {
                    username,
                    password,
                    created_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
                crud("INSERT INTO `admin_users` set?", insertData, () => {
                    res.json({
                        status: 0,
                        mess: "添加成功"
                    })
                })
            }
        })
    })

    /**
     * 删除管理员
     */
    router.delete("/admin/deleteAdminUser", (req, res) => {
        let { adminUser_id } = req.query;
        crud("DELETE FROM `admin_users` WHERE id =?", [adminUser_id], () => {
            res.json({
                status: 0,
                mess: "删除成功"
            })
        })
    })
}