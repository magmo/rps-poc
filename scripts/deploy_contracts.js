module.exports = {
    deployContracts: function () {
        const path = require('path');
        const {
            spawnSync
        } = require('child_process');
        process.env.TARGET_NETWORK = process.env.TARGET_NETWORK || 'development';

        const trufflePath = path.resolve(__dirname, '../node_modules/.bin/truffle');

        const migrate = spawnSync(trufflePath, ['migrate', '--network', process.env.TARGET_NETWORK.toString()]);
        console.log(migrate.stdout.toString());
        if (migrate.stderr.toString() !== '') {
            console.log(`Deploy failed with error ${migrate.stderr.toString()}`);
            process.exit(1);
        }
    }
}