/* global module, require */
const extend = require('extend');
const dev = require('./config.dev');

module.exports = extend(dev, {

    projectsService: {
        defaultUrl: 'https://teamcity.jetbrains.com/guestAuth/',
        path: 'app/rest/projects?fields=$long,project(' +
              'id,name,parentProject(id),buildTypes($long,buildType(id,name)))'
    },
    server: {
        host: '0.0.0.0',
        port: 3000
    }

});