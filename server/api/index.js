module.exports = (app, express) => {
    // 引入session
    require("../session")(app);

    // 创建路由
    const router = express.Router();
    app.use("/api", router);

    // 使用插入到接口
    const crud = require("../crud");

    // 城市地址
    require("./cities")(router, crud);

    // 登录和注册
    require("./login_register")(router, crud);

    // 文章管理
    require("./post")(router, crud);

    // 评论管理
    require("./comment")(router, crud);

    // 后台系统
    require("./admin")(router, crud);

    // 静态文件托管 保存头像
    app.use(express.static("../upload/avatar"));
}