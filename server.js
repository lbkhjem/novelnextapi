const express = require("express");
const next = require("next");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const port = parseInt(process.env.PORT, 10) || 8002;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
server.use(cors());
app.prepare().then(() => {
  
  // var corsOptions = function(req, res, next){ 
  //   res.header('Access-Control-Allow-Origin', '*'); 
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 
  //   'Content-Type, Authorization, Content-Length, X-Requested-With');
  //    next();
  // }
  
  // server.use(corsOptions);
  
  // const limiter = rateLimit({
  //   windowMs: 10 * 1000, // 15 minutes
  //   max: 3, // limit each IP to 100 requests per windowMs
  // });

  // server.use(limiter);
  // server.set("trust proxy", 1);

  server.get("/api/update", (req, res) => {
    return handle(req, res);
  });
  server.get("/api/hot", (req, res) => {
    return handle(req, res);
  });
  server.get("/api/complete", (req, res) => {
    return handle(req, res);
  });
  server.get("/api/novel", (req, res) => {
    return handle(req, res);
  });
  server.get("/api/chapter", (req, res) => {
    return handle(req, res);
  });
  server.get("*/*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
