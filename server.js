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

  // Check if path is a directory
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    if (stats.isDirectory()) {
      // Don't show hidden directories
      if (path.basename(filePath).startsWith('.')) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      fs.readdir(filePath, (err, files) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }

        // Filter out hidden files
        files = files.filter(file => !file.startsWith('.'));

        // Create HTML directory listing
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Directory listing for ${req.url}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                ul { list-style-type: none; padding: 0; }
                li { margin: 5px 0; }
                a { text-decoration: none; color: #0366d6; }
                a:hover { text-decoration: underline; }
              </style>
            </head>
            <body>
              <h1>Directory listing for ${req.url}</h1>
              <ul>
                ${req.url !== '/' ? '<li><a href="..">..</a></li>' : ''}
                ${files.map(file => `<li><a href="${path.join(req.url, file)}">${file}</a></li>`).join('\n')}
              </ul>
            </body>
          </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      });
    } else {
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
          contentType = 'text/yaml';
          break;
        case '.yml':
          contentType = 'text/yaml';
          break;
      }

      // Read file
      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code == 'ENOENT') {
            res.writeHead(404);
            res.end(`Not Found`);
          } else {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf8');
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));