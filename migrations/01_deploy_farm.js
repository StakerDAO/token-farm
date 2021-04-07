const farm = artifacts.require('farm');
const saveContractAddress = require('./../helpers/saveContractAddress');
const initialStorage = require('./initialStorage/farm');

module.exports = async (deployer, network, accounts) => {
    deployer.deploy(farm, initialStorage.default.base())
        .then(contract => saveContractAddress('farm', contract.address));
};
