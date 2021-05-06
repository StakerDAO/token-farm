const { execSync } = require('child_process');
const { existsSync } = require('fs');

const baseOptions = { stdio: 'inherit' }; 
const basePath = './scripts/contracts/quipuswap';

const init = () => {
    if (!existsSync(basePath)) {
        console.log('Initializing wrapped-xtz project');
        execSync(`git clone https://github.com/stove-labs/quipuswap-core ${basePath}`, baseOptions)
        // default branch is 'test/token-farm'
    }
    execSync(`cd ${basePath} && yarn`, baseOptions)
}

const migrate = () => {
    init();
    console.log('Starting sandbox')
    execSync(`cd ${basePath} && yarn test`, baseOptions)
}

module.exports = { init, migrate };