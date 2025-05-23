@echo off
REM 用于生成自签名证书的脚本

mkdir cert
cd cert

REM 生成私钥和证书
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"

echo.
echo 证书已生成完毕!
echo 私钥文件: cert\key.pem
echo 证书文件: cert\cert.pem
echo.
echo 要运行HTTPS服务器，请安装Node.js，然后执行:
echo npm install express
echo node server.js
echo.

pause