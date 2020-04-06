module.exports = (router, crud) => {
    /**
     *  新建一篇文章，导入数据库
     * */
    const moment = require("moment"); //格式化时间工具
    router.post("/setPost", (req, res) => {
        if (req.session.userInfo) {
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
     * req.query.sort_rule 为1正序，为2倒序
     * req.query.sort_orderBy 为0按时间排序，为1点赞量排序，为2阅读量排序
     */
    router.post("/get_allPost", (req, res) => {
        let sort_orderBy = req.query.sort_orderBy === "1" ? "ASC" : "DESC";
        let sort_rule;
        // 给sort_orderBy赋值，赋的值都是对应post表中的栏位名
        switch (req.query.sort_rule) {
            case "0":
                sort_rule = "post_createTime"
                break;
            case "1":
                sort_rule = "post_praise_count"
                break;
            case "2":
                sort_rule = "post_read_count"
                break;
            default:
                sort_rule = "post_createTime"
                break;
        }
        crud("SELECT * FROM `post` LEFT JOIN `users` ON post.post_masterId = users.user_id ORDER BY " + sort_rule + ' ' + sort_orderBy + "", [],
            data => {
                res.json({
                    state: 0,
                    allPost: data
                });
            });
    });

    /**
     * 对文章点赞
     * state为0代表取消点赞
     * state为1代表点赞
     * state为2代表未登录
     */
    router.get("/addSupport", (req, res) => {
        if (req.session.userInfo) {
            /**
             *先检查post_support 是否有该用户对改文章的点赞记录，
             *若有的话就删除该条数据并在post表中post_praise_count减一
             *若没有的话就增加该条数据并在post表中post_praise_count加一
            * */
            crud("SELECT * FROM `post_support` WHERE post_id = ? AND user_id = ?", [req.query.post_id, req.session.userInfo.user_id], data => {
                if (data.length > 0) {
                    crud("DELETE FROM `post_support` WHERE id =?", [data[0].id], data => {
                        crud("UPDATE `post` SET post_praise_count = post_praise_count - 1 WHERE post_id =?", [req.query.post_id], data => {
                            res.json({ state: 0 })
                        })
                    })
                } else {
                    crud("INSERT INTO `post_support` SET ?", { "post_id": req.query.post_id, "user_id": req.session.userInfo.user_id }, data => {
                        crud("UPDATE `post` SET post_praise_count = post_praise_count + 1 WHERE post_id =?", [req.query.post_id], data => {
                            res.json({ state: 1 })
                        })
                    })
                }
            })
        } else {
            res.json({ state: 2 })
        }
    });

    /**
     * 初始化该用户对文章的点赞情况
     */
    router.get("/getSupportArr", (req, res) => {
        let arr = [];
        if (req.session.userInfo) {
            crud("SELECT * FROM `post_support` WHERE user_id = ?", [req.session.userInfo.user_id], data => {
                if (data.length > 0) {
                    data.forEach(item => {
                        arr.push(item.post_id);
                    })
                    res.json({
                        state: 0,
                        arr
                    })
                }
            })
        }
    });
}