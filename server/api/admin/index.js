module.exports = (router, crud) => {
    // 后台登录
    require("./admin_login")(router, crud);
    // 后台文章
    require("./admin_post")(router, crud);
}