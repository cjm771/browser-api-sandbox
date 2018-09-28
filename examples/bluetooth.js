// Bluetooth
// returns a promise with device instance

// Sample output:
// ----------------
// gatt: BluetoothRemoteGATTServer
// connected: false
// device: BluetoothDevice
// gatt: BluetoothRemoteGATTServer {connected: false, device: BluetoothDevice}
// id: "at8KLVliv1NmNoqkCQiFkg=="
// name: "Christopher's iPhone"
// ongattserverdisconnected: null
// __proto__: BluetoothDevice
// __proto__: BluetoothRemoteGATTServer
// id: "at8KLVliv1NmNoqkCQiFkg=="
// name: "Christopher's iPhone"
// ongattserverdisconnected: null

//request devices (as browser dialog) to choose one to pair
navigator.bluetooth.requestDevice({
  acceptAllDevices: true
}).then(device => {
  // once selected in browser, promise will give us a device..
  // ... not sure what you can do with it..but..
  console.log(device);
})