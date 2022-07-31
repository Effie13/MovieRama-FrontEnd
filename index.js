'use strict';

const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const serveStatic = require('serve-static');
const cors = require('cors')

const app = express();

const port = 8000;

// Don't cache HTML files for local dev
const cacheHeaders = (res, path) => {
	if (serveStatic.mime.lookup(path) === 'text/html') {
		// Custom Cache-Control for HTML files
		res.setHeader('Cache-Control', 'public, max-age=0');
		res.setHeader('Access-Control-Allow-Origin: *');
		res.header("Set-Cookie: cross-site-cookie=whatever; SameSite=None; Secure");
	}
}

app.use(cors());

// In dev, serve our source files so that Source Maps can correctly load their
// original files.
app.use('/src', serveStatic('src', {
	maxAge: '1h',
	setHeaders: cacheHeaders
}));

app.get('/', (req, res) => {
    res.sendFile('/src/index.html', {root: __dirname});  
});

const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};
  
https.createServer(options, app).listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});