const execSync = require('child_process').execSync;
const POWER_MANIFST = 'e5904d27b842626d134015cefb305ad42a5ca49f239f48bab973ab896692e19f';
const contract = require("truffle-contract");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

exports = module.exports = function (server) {
  let date = new Date();

  //TODO: get this hash by uploading some content from the tenere tree
  let newHash = 'e5904d27b842626d134015cefb305ad42a5ca49f239f48bab973ab896692e19f';

  let newManifestHash = execSync('swarm manifest add ' + POWER_MANIFST +
  ' ' + date.toISOString() + ' ' + newHash).toString();

  //create a reference to the deployed tree contract
  var tree_json = require("../build/contracts/Tree.json");
  var Tree = contract(tree_json);
  Tree.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
  Tree.deployed().then(function(deployed) {

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
  });
};
