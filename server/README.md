# HTTPS Local Server Guide

This document provides guidance on how to set up and use an HTTPS local server. This is necessary to allow access to the camera and other hardware features in non-localhost environments.

## Installation Steps

1. **Install Node.js**
   - Download and install the latest LTS version from [Node.js official website](https://nodejs.org/)

2. **Install Required Dependencies**
   ```
   npm install express cors
   ```

3. **Generate SSL Certificate**
   - Windows users: Run `generate-cert.bat`
   - Mac/Linux users: Run `./generate-cert.sh`
   
   If you encounter permission issues, make sure the script has execute permissions:
   ```
   chmod +x generate-cert.sh
   ```

4. **Start the Server**
   ```
   node server.js
   ```

5. **Access the Application**
   - Visit `https://localhost:3000` in your browser
   - You will see a security warning (this is because we're using a self-signed certificate)
   - Click "Advanced" and then "Proceed" (options may vary by browser)

## Notes

- Self-signed certificates are only suitable for development environments
- Browsers may need to clear cache or re-accept the certificate after regenerating it
- If you want to share the application on your local network, use the IP address displayed when the server starts

# HTTPS本地服务器说明

本文档提供如何设置和使用HTTPS本地服务器的指导。这对于允许在非localhost环境下访问摄像头和其他硬件功能是必需的。

## 安装步骤

1. **安装Node.js**
   - 从 [Node.js官网](https://nodejs.org/) 下载并安装最新的LTS版本

2. **安装所需依赖**
   ```
   npm install express cors
   ```

3. **生成SSL证书**
   - Windows用户: 运行 `generate-cert.bat`
   - Mac/Linux用户: 运行 `./generate-cert.sh`
   
   如果遇到权限问题，请确保脚本有执行权限：
   ```
   chmod +x generate-cert.sh
   ```

4. **启动服务器**
   ```
   node server.js
   ```

5. **访问应用**
   - 浏览器访问 `https://localhost:3000`
   - 您将看到安全警告（这是因为使用了自签名证书）
   - 点击"高级"然后"继续访问"（具体选项因浏览器而异）

## 注意事项

- 自签名证书仅适用于开发环境
- 每次重新生成证书后，浏览器可能需要清除缓存或重新接受证书
- 如果您想在局域网内共享应用，请使用服务器启动时显示的IP地址
