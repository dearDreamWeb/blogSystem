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
                "comment_createTime": date
            }
            crud("INSERT INTO `comment` SET ?", objData, () => {
                res.json({state: 0});
            })
        } else {
            res.json({ state: 1 });
        }
    })
}