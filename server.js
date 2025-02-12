const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Redirect root to apoxy.dev
  if (req.url === '/' || req.url === 'server.js') {
    res.writeHead(301, { Location: 'https://apoxy.dev' });
    res.end();
    return;
  }

  // Get the file path
  let filePath = path.join(__dirname, req.url);

  // Get the file extension
  let extname = path.extname(filePath);

  // Default content type
  let contentType = 'text/html';

  // Check ext and set content type
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.yaml':
      contentType = 'application/x-yaml';
      break;
    case '.yml':
      contentType = 'application/x-yaml';
      break;
  }

  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // Page not found
        res.writeHead(404);
        res.end(`Not Found`);
      } else {
        // Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
