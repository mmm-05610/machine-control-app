const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 创建窗口并加载登录页
function createWindow() {
  // 配置窗口大小、标题等（合并所有窗口配置）
  const mainWindow = new BrowserWindow({
    width: 390,         // 缩小窗口宽度，更像登录框
    height: 640,        // 缩小窗口高度
    title: "机床控制软件 - 登录",
    autoHideMenuBar: true,  // 隐藏菜单栏
    frame: false,           // 去掉系统默认边框（纯自定义样式）
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.setMaximizable(false); // 禁止最大化
  // 加载登录页
  mainWindow.loadFile(path.join(__dirname, 'login.html'));
  // 打开开发者工具（调试用，发布时可删除）
  mainWindow.webContents.openDevTools();



  // 监听关闭窗口事件
  ipcMain.once('close-login-window', () => {
    mainWindow.close();

  });

  //监听登陆成功信息
  ipcMain.once('login-success', () => {
    mainWindow.close();
    // 打开主页面窗口
    const indexWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      title: "机床控制软件",
      autoHideMenuBar: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    indexWindow.setMaximizable(false); // 禁止最大化
    indexWindow.loadFile(path.join(__dirname, 'index.html'));
    // 打开开发者工具（调试用，发布时可删除）
    indexWindow.webContents.openDevTools();
    // 监听关闭窗口事件
    ipcMain.once('close-index-window', () => {
      if (!indexWindow.isDestroyed()) {
        indexWindow.close();
      }
    });
  });
}

// 仅在app就绪后创建一次窗口（核心修复点）
app.whenReady().then(() => {
  createWindow();

  // macOS特殊处理（窗口激活时重建）
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 关闭所有窗口时退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
