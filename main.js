const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let backend;
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  }
}

app.whenReady().then(() => {
  if (!isDev) {
    const backendPath = path.join(__dirname, 'start_backend.exe');
    backend = spawn(backendPath, {
      shell: true,
      stdio: 'pipe',
    });

    backend.stdout.on('data', (data) => {
      console.log(`[backend stdout]: ${data}`);
    });

    backend.stderr.on('data', (data) => {
      console.error(`[backend stderr]: ${data}`);
    });

    backend.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    // Wait until backend URL is ready before creating the window
    waitOn(
      {
        resources: ['http://127.0.0.1:8000/dashboard'],
        timeout: 10000, // 10 seconds timeout
      },
      (err) => {
        if (err) {
          console.error('Backend did not become available:', err);
          app.quit();
          return;
        }
        createWindow();
      }
    );
  } else {
    createWindow();
  }

  app.on('window-all-closed', () => {
    if (backend) {
      backend.kill();
    }
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
