module.exports = (app,express) => {
    // 创建路由
    const userRouter = express.Router();
    app.use("/api",userRouter);

    // 使用插入到接口
    const crud = require("../crud");

    // 引入随机id值
    const randomId = require("../randomId");

}