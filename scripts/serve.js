const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = parseInt(process.env.PORT || '8080', 10);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0].split('#')[0];
    if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

    const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT_DIR, safePath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:system-ui;background:#090d16;color:#f8fafc;padding:40px;text-align:center;"><h1>404 - File Not Found</h1><p><a href="/index.html" style="color:#38bdf8;">Return to MediCare HMS Portal</a></p></body></html>');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
    // Get local network IPv4 address for multi-device testing
    const nets = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
                break;
            }
        }
    }

    console.log('\n============================================================');
    console.log('🏥 MediCare HMS - Enterprise Healthcare SaaS Server Ready');
    console.log('============================================================');
    console.log(`💻 Local Access:      http://localhost:${PORT}`);
    console.log(`📱 LAN/Phone Access:  http://${localIp}:${PORT}`);
    console.log(`📽️ Pitch Slides:     http://localhost:${PORT}/slides.html`);
    console.log('------------------------------------------------------------');
    console.log('Press Ctrl+C to terminate the local server\n');
});
