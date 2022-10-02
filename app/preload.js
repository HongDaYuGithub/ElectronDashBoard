const { contextBridge, ipcRenderer } = require("electron");

//args are params
contextBridge.exposeInMainWorld("electronAPI", {
  addTreeNode: () => ipcRenderer.invoke("Tree:add"),
  RecvRouteInfo: (event, args) =>
    ipcRenderer.invoke("Recv:RouteInfo", event, args),
});
