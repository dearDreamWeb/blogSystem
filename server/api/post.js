module.exports = (router, crud) => {
    /**
     *  新建一篇文章，导入数据库
     * */
    const moment = require("moment"); //格式化时间工具
    router.post("/setPost", (req, res) => {
        if (req.session) {
            // 新建时间
            let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            // 引入随机id值
            let randomId = require("../randomId")();
            // 插入的数据
            let objData = {
                post_id: randomId,
                post_masterId: req.session.userInfo.user_id,
                post_title: req.body.title,
                post_content: req.body.content,
                post_createTime: date
            }
            crud("INSERT INTO `post` SET ?", objData, data => {
                res.json({ state: 0 });
            })
        }
    });

    /**
     * 获取所有文章
     */
    router.post("/get_allPost", (req, res) => {
        crud("SELECT * FROM `post` LEFT JOIN `users` ON post.post_masterId = users.user_id ORDER BY post_createTime DESC", [], 
        data => {
            res.json({
                state: 0,
                allPost: data
            });
        });
    });
}