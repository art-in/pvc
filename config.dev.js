/* global require, module, __dirname */
const path = require('path');
const abs = p => path.join(__dirname, p);

module.exports = {

    root: __dirname,
    src: {
        serv: {
            root: abs('./src/server/'),
            entry: abs('./src/server/index.js'),
            output: {
                path: abs('./dist/server/'),
                name: 'index.js'
            }
        },
        client: {
            root: abs('./src/client/'),
            entry: abs('./src/client/index.js'),
            output: {
                path: abs('./dist/client/'),
                bundle: {
                    path: abs('./dist/client/bundle/'),
                    urlPath: '/bundle/',
                    name: 'bundle.js'
                }
            }
        }
    },
    test: {
        root: abs('./test/'),
        unit: {
            entry: abs('./test/unit/entry.js'),
            output: {
                path: abs('./test/unit/dist/'),
                name: 'bundle-test.js'
            }
        }
    },
    dev: {
        server: {
            host: 'localhost',
            port: 3001
        }
    }
    
};