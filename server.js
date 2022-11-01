const express = require("express");
var createError = require("http-errors");
const cors = require("cors");
const next = require("next");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
const port = parseInt(process.env.PORT, 10) || 8002;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
// var app = express();
const handle = app.getRequestHandler();
// app.use("/", indexRouter);
app.prepare().then(() => {
  const server = express();
  var corsOptions = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    next();
  };

  server.use(corsOptions);
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'pug');
  server.use('/', indexRouter);
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
