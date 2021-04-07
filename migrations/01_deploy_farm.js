const farm = artifacts.require('farm');
const saveContractAddress = require('./../helpers/saveContractAddress');
const initial_storage = require('./initialStorage/farm');

module.exports = async (deployer, network, accounts) => {
    deployer.deploy(farm, initial_storage.default.base())
        .then(contract => saveContractAddress('farm', contract.address));

};
