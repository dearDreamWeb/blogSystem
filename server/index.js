const express = require("express");
const app = express();
app.listen(3000);

// 解决跨域
require("./cors")(app);

// 引入api
require("./api")(app,express);
