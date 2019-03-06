var DrugValidation = artifacts.require("./DrugValidation.sol");

module.exports = function(deployer) {
  deployer.deploy(DrugValidation);
};
