module.exports = (router, crud) => {
    /**
     * 获取过滤后的文章
     * selectedValue 为0时，文章按ID查询；为1时，按文章标题或内容查询；为2时，按作者查询；为3时，按文章标签查询
     */
    router.get("/admin/postLists", (req, res) => {
        let sort_orderBy = req.query.sort_orderBy === "1" ? "ASC" : "DESC";
        let {
            selectedValue,  // 搜索类型
            keyWord,       // 搜索的关键字
            currentPage,   // 当前页数
            pageSize        // 每页多少条数据
        } = req.query;
        let currentIndex = (currentPage - 1) * pageSize; // 开始索引的值
        // 有关键字的话，按照selectedValue判断搜索类型
        if (keyWord) {
            switch (selectedValue) {
                // 文章按ID查询
                case "0":
                    crud(`SELECT * FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id 
                    WHERE post_id = ?
                    ORDER BY `+ "`post_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [keyWord], data => {
                        if (data.length > 0) {
                            data.forEach(item => {
                                item.user_password = ""
                            })
                        }
                        res.json({
                            status: 0,
                            allPost: data,
                            total: data.length
                        });
                    });
                    break;
                // 按文章标题或内容查询
                case "1":
                    crud(`SELECT count(post_id) FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id 
                    WHERE post_title LIKE "%${keyWord}%" OR post_content LIKE "%${keyWord}%"`, [], num => {
                        let total = num[0]["count(post_id)"];
                        crud(`SELECT * FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id 
                        WHERE post_title LIKE "%${keyWord}%" OR post_content LIKE "%${keyWord}%"
                        ORDER BY `+ "`post_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [], data => {
                            if (data.length > 0) {
                                data.forEach(item => {
                                    item.user_password = ""
                                })
                            }
                            res.json({
                                status: 0,
                                allPost: data,
                                total: total
                            });
                        });
                    })

                    break;
                // 按作者查询
                case "2":
                    crud(`SELECT count(post_id) FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id WHERE user_nickName=? `, [keyWord], num => {
                        let total = num[0]["count(post_id)"];
                        crud(`SELECT * FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id WHERE user_nickName=? 
                        ORDER BY `+ "`post_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [keyWord], data => {
                            res.json({
                                status: 0,
                                allPost: data,
                                total: total
                            });
                        })
                    })
                    break;
                // 按文章标签查询
                case "3":
                    crud(`SELECT count(post_id) FROM ` + "`post`" + ` WHERE post_tag = ? `, [keyWord], num => {
                        let total = num[0]["count(post_id)"];
                        crud(`SELECT * FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id WHERE post_tag =? 
                        ORDER BY `+ "`post_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [keyWord], data => {
                            res.json({
                                status: 0,
                                allPost: data,
                                total: total
                            });
                        })
                    })
                    break;
                default:
                    break;
            }
        } else {
            crud(`SELECT count(post_id) FROM ` + "`post`" + ` `, [], num => {
                let total = num[0]["count(post_id)"];
                crud(`SELECT * FROM ` + "`post`" + ` LEFT JOIN ` + "`users`" + ` ON post.post_masterId = users.user_id 
                ORDER BY `+ "`post_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [], data => {
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
     * 删除文章
     */
    router.delete("/admin/deletPost", (req, res) => {
        let { post_id } = req.query;
        crud(`DELETE FROM ` + "`post`" + ` WHERE post_id=?`, [post_id], () => {
            res.json({
                status: 0,
                mess: "删除成功过"
            })
        })
    })
}