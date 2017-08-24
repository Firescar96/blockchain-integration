var Tree = artifacts.require("./Tree.sol");
var TenereToken = artifacts.require("./TenereToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TenereToken)
  TenereToken.deployed().then(tenereToken => {
    deployer.deploy(Tree, tenereToken.address).then(() =>{
      tenereToken.setOwner(Tree.address);
      Tree.deployed().then(tree => {
        tree.addSensor("power", 1, 'e5904d27b842626d134015cefb305ad4', '2a5ca49f239f48bab973ab896692e19f')
      })
    })
  })
};