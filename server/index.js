const express = require("express");
const app = express();
app.listen(3000);

// post数据
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 解决跨域
require("./cors")(app);

// history模式
var history = require('connect-history-api-fallback');
app.use(history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /^\/.*$/,
      to: function (context) {
        return "/";
      }
    },
  ]
}));


// 引入api
require("./api")(app, express);
