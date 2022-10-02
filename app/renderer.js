function getIpAddress() {
  return $("#ipInput").textbox("getValue");
}

function getL3Type() {
  return $("#SelectConnectMode").combobox("getValue");
}

//trans one arg
$("#Connect").click(async () => {
  let L3Type = getL3Type();
  let Type = L3Type.split(" ");
  console.log(Type[1]);
  const TreeNode = await window.electronAPI.RecvRouteInfo(
    Type[1] + "@" + getIpAddress() + ":" + "8080"
  );
  console.log(TreeNode); //parse tree node
  var TestAck = new RegExp("inValidIp:.*");
  if (TestAck.test(TreeNode)) {
    $.messager.alert("Warn", TreeNode, "warn");
  }
});

// auto refresh tree
$(function () {});
