const config = require('../../config');
const packer = require('../packer');

module.exports = {
    deps: ['build:client:static'],
    fn: function() {
        return packer.pack({
            root: config.src.client.root,
            entry: config.src.client.entry,
            output: {
                path: config.src.client.output.bundle.path,
                urlPath: config.src.client.output.bundle.urlPath,
                name: config.src.client.output.bundle.name
            },
            watch: true,
            server: {
                host: 'localhost',
                port: config.server.port
            },
            devServer: {
                host: config.dev.server.host,
                port: config.dev.server.port
            }
        });
    }
};