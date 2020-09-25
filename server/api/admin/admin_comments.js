module.exports = (router, crud) => {
    /**
     * 获取过滤后的文章
     * selectedValue 为0时，按评论ID查询；为1时，按评论内容查询；为2时，按评论者查询
     */
    router.get("/admin/commentsLists", (req, res) => {
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
                // 按评论ID查询
                case "0":
                    crud(`SELECT * FROM ` + "`comment`" + ` LEFT JOIN ` + "`users`" + ` ON comment.comment_masterId = users.user_id 
                    WHERE comment_id = ?
                    ORDER BY `+ "`comment_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [keyWord], data => {
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
                // 按评论内容查询
                case "1":
                    crud(`SELECT count(comment_id) FROM ` + "`comment`" + ` LEFT JOIN ` + "`users`" + ` ON comment.comment_masterId = users.user_id 
                    WHERE comment_content LIKE "%${keyWord}%"`, [], num => {
                        let total = num[0]["count(comment_id)"];
                        crud(`SELECT * FROM ` + "`comment`" + ` LEFT JOIN ` + "`users`" + ` ON comment.comment_masterId = users.user_id
                        WHERE comment_content LIKE "%${keyWord}%"
                        ORDER BY `+ "`comment_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [], data => {
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
                // 按评论者查询
                case "2":
                    crud(`SELECT count(comment_id) FROM ` + "`comment`" + ` LEFT JOIN ` + "`users`" + ` ON comment.comment_masterId = users.user_id  WHERE user_nickName=? `, [keyWord], num => {
                        let total = num[0]["count(comment_id)"];
                        crud(`SELECT * FROM ` + "`comment`" + ` LEFT JOIN ` + "`users`" + ` ON comment.comment_masterId = users.user_id  WHERE user_nickName=? 
                        ORDER BY `+ "`comment_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [keyWord], data => {
                            res.json({
                                status: 0,
                                allPost: data,
                                total: total
                            });
                        })
                    })
                    break;
            }
        } else {
            crud(`SELECT count(comment_id) FROM ` + "`comment`" + ` `, [], num => {
                let total = num[0]["count(comment_id)"];
                crud(`SELECT * FROM ` + "`comment`" + ` LEFT JOIN ` + "`users`" + ` ON comment.comment_masterId = users.user_id 
                ORDER BY `+ "`comment_createTime`" + ` ${sort_orderBy} LIMIT ${currentIndex},${pageSize}`, [], data => {
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
     * 删除评论
     */
    router.delete("/admin/deletComment", (req, res) => {
        let { comment_id } = req.query;
        crud(`DELETE FROM ` + "`comment`" + ` WHERE comment_id=?`, [comment_id], () => {
            res.json({
                status: 0,
                mess: "删除成功过"
            })
        })
    })
}