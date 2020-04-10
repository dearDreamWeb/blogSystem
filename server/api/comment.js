module.exports = (router, crud) => {
    /**
     * 添加评论
    */
    const moment = require("moment"); //格式化时间工具
    router.post("/addComment", (req, res) => {
        if (req.session.userInfo) {
            // 新建时间
            let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            // 引入随机id值
            let randomId = require("../randomId")();
            // 插入的数据
            let objData = {
                "comment_id": randomId,
                "comment_masterId": req.session.userInfo.user_id,
                "comment_content": req.body.content,
                "comment_createTime": date,
                "comment_postId": req.body.post_id
            }
            // 插入并更新post表中的阅读次数，再查询刚插入的数据返给前端
            crud("INSERT INTO `comment` SET ?", objData, () => {
                crud("SELECT * FROM `comment` LEFT JOIN `users` ON  comment.comment_masterId = users.user_id WHERE comment_id = ?", [randomId], data => {
                    crud("UPDATE `post` SET post_comment_count = post_comment_count + 1 WHERE post_id = ?", [data[0].comment_postId], () => {
                        res.json({
                            state: 0,
                            commentData: data[0]
                        })
                    });
                })
            })
        } else {
            res.json({ state: 1 });
        }
    });


    /**
     * 获取指定文章的所有评论
    */
    router.post("/getComment", (req, res) => {
        crud("SELECT * FROM `comment` LEFT JOIN `users` ON  comment.comment_masterId = users.user_id WHERE comment_postId = ? ORDER BY comment_createTime DESC",
            [req.body.post_id], data => {
                res.json({
                    state: 0,
                    commentData: data
                })
            })
    });
}