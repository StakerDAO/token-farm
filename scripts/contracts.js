const action = process.argv[2];
const contractName = process.argv[3];

const contractScripts = require(`./contracts/${contractName}.js`);
contractScripts[action]();