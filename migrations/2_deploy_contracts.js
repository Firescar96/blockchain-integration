var Tree = artifacts.require("./Tree.sol");
var TenereToken = artifacts.require("./TenereToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TenereToken).then(() => {
    return TenereToken.deployed();
  })
  .then(tenereToken => {
    deployer.deploy(Tree, tenereToken.address).then(() =>{
      return Tree.deployed()
    }).then(tree => {
      tenereToken.setOwner(tree.address);
      tree.addSensor("power", 1, '4f983f498d42445c8c54a7dbe64542e3', '0dd3ac0d9f513b4fafae05e28c852b9b')
    })
  })
};