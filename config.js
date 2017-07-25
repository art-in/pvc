/* global require, module, __dirname */

const path = require('path');
const abs = p => path.join(__dirname, p);

module.exports = {
    src: {
        serv: {
            root: abs('./server/'),
            entry: abs('./server/index.js'),
            output: {
                path: abs('./dist/server/'),
                name: 'index.js'
            }
        },
        client: {
            root: abs('./client/'),
            entry: abs('./client/index.js'),
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
    projectsService: {
        defaultUrl: 'https://teamcity.jetbrains.com/guestAuth/',
        path: 'app/rest/projects?fields=$long,project(' +
              'id,name,parentProject(id),buildTypes($long,buildType(id,name)))'
    },
    dev: {
        server: {
            host: 'localhost',
            port: 3001
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3000
    }
};