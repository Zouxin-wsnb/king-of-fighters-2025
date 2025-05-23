# Pose Recognition Interactive Application -- King of Fighters 2025

## Quick Start Guide

### Getting the code from GitHub
1. Clone the repository:
   ```
   git clone https://github.com/[username]/king-of-fighters-2025.git
   ```
   Or download ZIP file from the GitHub repository page.

2. Navigate to the project folder:
   ```
   cd king-of-fighters-2025
   ```

3. Launch a local server:
   - Using VS Code Live Server extension
   - Using the included HTTPS server (see below)
   - Or any other local server solution

### Requirements
- Modern web browser (Chrome, Firefox, Edge)
- Webcam access
- JavaScript enabled

## Solutions for Using on IPv4 Addresses

### 1: Using HTTPS Local Server

See detailed instructions in [server/README.md](server/README.md).

Quick steps:
1. Install Node.js
2. Run `npm install express cors`
3. Run `server/generate-cert.bat` to generate certificates
4. Run `node server/server.js` to start the server
5. Access `https://localhost:3000` or `https://[your-ip-address]:3000`

### 2: Using Supported Browsers

This application has been tested and works well in:
- Chrome
- Firefox
- Edge

### 3: Using on localhost Only (Recommended)

- Access via local URL, such as VS Code Live Server `http://localhost:5500`
- Make sure to allow camera permissions

## Troubleshooting

1. If the application cannot access the camera:
   - Check if the browser has permissions to use the camera
   - Make sure the camera is working properly (test in other applications)
   - Check if any other application is currently using the camera

2. If you see CORS or network-related errors:
   - Make sure you are using HTTPS or localhost
   - No external API access is required, all functionality runs locally

3. If you still see a black screen:
   - The application will attempt to use a fallback
   - Make sure the required fallback media files are in the assets folder

# 姿势识别互动应用--拳皇2025

## 快速开始指南

### 从GitHub获取代码
1. 克隆仓库：
   ```
   git clone https://github.com/[用户名]/king-of-fighters-2025.git
   ```
   或从GitHub仓库页面下载ZIP文件。

2. 导航到项目文件夹：
   ```
   cd king-of-fighters-2025
   ```

3. 启动本地服务器：
   - 使用VS Code的Live Server扩展
   - 使用附带的HTTPS服务器（见下文）
   - 或任何其他本地服务器解决方案

### 需求
- 现代网页浏览器（Chrome、Firefox、Edge）
- 摄像头访问权限
- 启用JavaScript

## 在IPv4地址上使用的解决方案

### 1: 使用HTTPS本地服务器

详细说明请参考 [server/README.md](server/README.md) 文件中的指引。

简要步骤:
1. 安装Node.js
2. 运行 `npm install express cors`
3. 运行 `server/generate-cert.bat` 生成证书
4. 运行 `node server/server.js` 启动服务器
5. 访问 `https://localhost:3000` 或 `https://[您的IP地址]:3000`

### 2: 使用支持的浏览器

此应用在以下浏览器中测试良好：
- Chrome
- Firefox
- Edge

### 3: 仅在localhost上使用(推荐)

- 通过本地URL访问，例如使用VS code中的golive `http://localhost:5500`
- 确保允许摄像头权限

## 常见问题解决

1. 如果应用无法访问摄像头：
   - 检查浏览器是否获得了摄像头使用权限
   - 确保摄像头工作正常（可在其他应用中测试）
   - 检查是否有其他应用正在使用摄像头

2. 如果看到CORS或网络相关错误：
   - 请确保您使用了HTTPS或localhost访问
   - 不需要访问外部API，所有功能都在本地运行

3. 如果仍然看到黑屏：
   - 应用会尝试使用备用方案
   - 请确保assets文件夹中有所需的备用媒体文件