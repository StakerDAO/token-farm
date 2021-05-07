// indexOf returns -1 if value is not present
const tokenArgvIndex = process.argv.indexOf('--token');
const tokenArgv = process.argv[tokenArgvIndex + 1];
const defaultStandard = 'FA12';
const tokenStandard: string = (tokenArgvIndex == -1) ? defaultStandard : tokenArgv;

export default tokenStandard;
