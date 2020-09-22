module.exports = (router, crud) => {
    /**
     * 获取过滤后的文章
     * selectedValue 为0时，文章按ID查询；为1时，文章按标题查询；为2时，文章按内容查询；为3时，文章按标签查询
     */
    router.get("/admin/postLists", (req, res) => {
        let sort_orderBy = req.query.sort_orderBy === "1" ? "ASC" : "DESC";
        let {
            selectedValue,
            keyWord,
            currentPage,
            pageSize
        } = req.query;
        let currentIndex = (currentPage - 1) * pageSize; // 开始索引的值
        if (keyWord) {
            switch (selectedValue) {
                case 0:
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
}