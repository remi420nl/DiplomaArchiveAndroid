const Exemptions = artifacts.require("Exemptions");

module.exports = function (deployer) {
  deployer.deploy(Exemptions);
};
