const execSync = require('child_process').execSync;
const INITIAL_MANIFST = '4f983f498d42445c8c54a7dbe64542e30dd3ac0d9f513b4fafae05e28c852b9b';
const contract = require("truffle-contract");
const Web3 = require('web3');
const osc = require('osc');

exports = module.exports = function (server) {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  let udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
  });
  udpPort.open();

  //create a reference to the deployed tree contract
  var tree_json = require("../build/contracts/Tree.json");
  var Tree = contract(tree_json);
  Tree.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
  Tree.deployed().then(function(deployed) {

    deployed.getSensorInfo("power").then(sensorInfo => {
      let hash = web3.toAscii(sensorInfo[1]) + web3.toAscii(sensorInfo[2]);
      let manifest = execSync('curl http://localhost:8500/bzzr:/'+hash+' 2> /dev/null').toString();

      let manifestHash;
      if (manifest.indexOf('404 page not found') !== -1) {
        manifestHash = INITIAL_MANIFST;
      } else {
        manifestHash = hash;
      }

      udpPort.on('message', (message) => {
        console.log(message);

        return;
        let date = new Date();

        //TODO: get this hash by uploading some content from the tenere tree
        let newHash = '4f983f498d42445c8c54a7dbe64542e30dd3ac0d9f513b4fafae05e28c852b9b';

        let newManifestHash = execSync('swarm manifest add ' + manifestHash +
          ' ' + date.toISOString() + ' ' + newHash).toString();
        let hash1 = newManifestHash.substring(0, 32);
        let hash2 = newManifestHash.substring(32);

        //get a gas estimate for the upload
        deployed.setSensorRecord.estimateGas("power", deployed.address, hash1, hash2, {
          from: web3.eth.accounts[0]
        })
        .then( gas => {
          //upload the reference to the swarm file to the Tree contract
          deployed.setSensorRecord("power", deployed.address, hash1, hash2, {
            from: web3.eth.accounts[0],
            gas: gas*2,
          });
        })
      })
    })
  });
};
