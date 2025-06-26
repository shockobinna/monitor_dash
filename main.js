const { app, BrowserWindow, dialog } = require('electron');
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

  return win;
}

app.whenReady().then(() => {
  if (!isDev) {
    const backendPath = path.join(process.resourcesPath, 'start_backend.exe');
    backend = spawn(backendPath, {
      shell: true,
      stdio: 'pipe',
      cwd: path.dirname(backendPath),
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

    waitOn(
      {
        resources: ['http://127.0.0.1:8000/health'],
        timeout: 20000,
      },
      (err) => {
        if (err) {
          console.error('Backend did not become available:', err);
          dialog.showErrorBox(
            'Backend Error',
            'The backend service failed to start. Some features may not work.'
          );
        }
        createWindow();
      }
    );
  } else {
    createWindow();
  }

  app.on('window-all-closed', () => {
    if (backend) {
      console.log('Killing backend process...');
      backend.kill(); // Safer across platforms
    }

    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    if (backend) {
      console.log('App is quitting. Killing backend...');
      backend.kill();
    }
  });
});
