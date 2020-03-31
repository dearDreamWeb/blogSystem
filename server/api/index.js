module.exports = (app, express) => {
    // 引入session
    require("../session")(app);
    
    // 创建路由
    const router = express.Router();
    app.use("/api", router);


    // 使用插入到接口
    const crud = require("../crud");

    // 静态文件托管 保存头像
    app.use(express.static("./../upload/avatar"));

    // 引入随机id值
    // const randomId = require("../randomId");

    // 城市地址
    require("./cities")(router, crud);

    // 登录和注册
    require("./login_register")(router, crud);

}