// 一个简单的HTTPS本地服务器，用于开发环境
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors'); // 需要安装: npm install cors

const app = express();
const PORT = 3000;

// 启用CORS
app.use(cors());

// 提供静态文件
app.use(express.static(path.join(__dirname, '..'))); // 指向项目根目录

// 启动HTTPS服务器所需的证书
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};

// 创建HTTPS服务器
https.createServer(options, app).listen(PORT, () => {
  console.log(`安全服务器运行在 https://localhost:${PORT}`);
  console.log(`也可以使用您的局域网IP地址访问，例如 https://192.168.x.x:${PORT}`);
  console.log(`注意：由于使用的是自签名证书，您需要在浏览器中手动接受安全风险警告`);
});
