const express = require('express');
const next = require('next');
const rateLimit = require('express-rate-limit');

const port = parseInt(process.env.PORT, 10) || 8002;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const limiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 3, // limit each IP to 100 requests per windowMs
  });

  server.use(limiter);
  server.set('trust proxy', 1);

  server.get('/api/update', (req, res) => {
    console.log(req.headers);
    return handle(req, res);
  });

  server.get('/api/greet', (req, res) => {
    console.log(req.headers);
    return handle(req, res);
  });
  server.get('*/*', (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
