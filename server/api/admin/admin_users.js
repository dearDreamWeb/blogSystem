module.exports = (router, crud) => {
    /**
     * 获取过滤后的文章
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
        console.log(user_id);
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
    router.delete("/admin/deletUser", (req, res) => {
        let { comment_id } = req.query;
        crud(`DELETE FROM ` + "`comment`" + ` WHERE comment_id=?`, [comment_id], () => {
            res.json({
                status: 0,
                mess: "删除成功过"
            })
        })
    })
}