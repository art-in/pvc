/* global require, module, __dirname */
const path = require('path');
const abs = p => path.join(__dirname, p);

module.exports = {

    path: __dirname,
    src: {
        path: abs('./src/'),
        serv: {
            path: abs('./src/server/'),
            entry: abs('./src/server/index.js'),
            output: {
                path: abs('./dist/server/'),
                name: 'index.js'
            }
        },
        client: {
            path: abs('./src/client/'),
            entry: abs('./src/client/index.js'),
            output: {
                path: abs('./dist/client/'),
                bundle: {
                    path: abs('./dist/client/bundle/'),
                    urlPath: '/bundle/',
                    name: 'bundle.js'
                }
            }
        },
        shared: {
            path: abs('./src/shared/'),
            output: {
                path: abs('./dist/shared/')
            }
        }
    },
    test: {
        path: abs('./test/'),
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