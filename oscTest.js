const osc = require('osc');

let udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57122,
    remoteAddress: "127.0.0.1",
    remotePort: 57121,
});

udpPort.open()

udpPort.send({
  address: '/',
  args: 'asdad'
})