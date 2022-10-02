const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

var create_flag = 0;
var udpServer = undefined;
var udpMsg = undefined;
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

const dgram = require("dgram");
const { Notification } = require("electron");

class UdpServer {
  constructor(ip, port) {
    this.ip = ip;
    this.port = port;
  }
  connect() {
    this.fd = dgram.createSocket("udp4");
    this.fd.bind(this.port);
  }
  recv(Msg) {
    this.fd.on("listening", () => {
      new Notification({ title: "Listen 127.0.0.1:8080" }).show();
    });
    this.fd.on("message", (message, rinfo) => {
      new Notification({ title: rinfo.address }).show();
      udpMsg = message;
    });
  }
  log() {
    this.fd.on("error", (err) => {
      new Notification({
        title: "Udp connect error",
        body: err,
      }).show();
      server.close();
    });
  }
}

function isValidIP(ip) {
  var reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(ip);
}

async function handleRoutInfo(event, args) {
  let mode = args.split("@");
  let ipInfo = mode[1].split(":");
  let ip = ipInfo[0];
  let port = ipInfo[1];
  let tmp = undefined;

  if (isValidIP(ip) == false) {
    return "inValidIp: ";
  }

  if (mode == "UDP") {
  }

  return "recv: " + udpMsg;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile(path.join(__dirname, "ui/index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("Recv:RouteInfo", handleRoutInfo);
  createWindow();
  udpServer = new UdpServer("127.0.0.1", 8080);
  udpServer.connect();
  udpServer.recv(udpMsg);
  udpServer.log();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
