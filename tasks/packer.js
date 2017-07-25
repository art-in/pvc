const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');
const assert = require('assert');
const WebpackDevServer = require('webpack-dev-server');

/**
 * Gets client assets bundling config
 *
 * Use when config required without run,
 * eg. when webpack run by other tool, eg. by karma
 *
 * @param {object} opts
 * @param {string|array} root - module resolve root path
 * @param {object}  opts.output
 * @param {string} opts.output.path - output bundle path
 * @param {string} opts.output.urlPath -
 *                URL path where bundle will be requested from (eg. '/public/')
 * @param {string} opts.output.name - output bundle name
 * @param {boolean} [opts.watch=false] - rebuild on changes
 * @param {string}  [opts.entry] - entry module path
 * @param {object}  [opts.server] - prod server (static, api)
 * @param {string}  [opts.server.host]
 * @param {string}  [opts.server.port]
 * @param {object}  [opts.devServer] - dev server (bundle HMR)
 * @param {string}  [opts.devServer.host]
 * @param {string}  [opts.devServer.port]
 *
 * @return {object} config
 */
function getPackConfig(opts) {
    
    assert(opts.root);
    assert(opts.output);
    assert(opts.output.path);
    assert(opts.output.urlPath);
    assert(opts.output.name);
    if (opts.watch) {
        assert(opts.server);
        assert(opts.server.host);
        assert(opts.server.port);
        assert(opts.devServer);
        assert(opts.devServer.host);
        assert(opts.devServer.port);
    }

    const entries = [];
    const plugins = [];
    const loaders = {js: []};
    const resolveModules = [];

    if (opts.watch) {
        entries.push(
            'react-hot-loader/patch',
            `webpack-dev-server/client?` +
                `http://${opts.devServer.host}:${opts.devServer.port}/`,
            'webpack/hot/only-dev-server'
        );

        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NamedModulesPlugin());
        plugins.push(new webpack.NoEmitOnErrorsPlugin());
    }

    entries.push('babel-polyfill');

    if (opts.entry) {
        // entry point not always required
        // (eg. when webpack run by karma)
        entries.push(opts.entry);
    }

    let root = opts.root;
    if (typeof root === 'string') {
        root = [root];
    }
    root.forEach(p => resolveModules.push(path.resolve(__dirname, p)));
    
    return {
        // eval-source-map gives stacktraces without source file:line
        // (when stacktrace passed from chrome/phantomjs to terminal by karma)
        devtool: 'inline-source-map',
        entry: entries,
        output: {
            path: opts.output.path,
            filename: opts.output.name,
            publicPath: opts.output.urlPath
        },
        plugins: [].concat(plugins),
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: loaders.js.concat([
                    {loader: 'babel-loader'}
                ]),
                exclude: [/node_modules/]
            }, {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[name]-[local]'
                    }
                }]
            }]
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: resolveModules.concat(['node_modules'])
        }
    };
}

/**
 * Packs client assets into bundle
 *
 * @param {object} opts
 * @return {promise}
 */
function pack(opts) {

    const config = getPackConfig(opts);

    let resolve;

    const promise = new Promise(res => {
        resolve = res;
    });

    const compiler = webpack(config,
        function(err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', stats.toString('minimal'));
            
            resolve();
        });

    if (opts.watch) {

        const server = new WebpackDevServer(compiler, {
            // dev server will replace requests to this URL
            // with dynamically generated stuff (ie. in-memory generated bundle)
            publicPath: opts.output.urlPath,

            historyApiFallback: true,
            hot: true,
            
            proxy: {
                // proxying all requests (except bundle request)
                // to prod server (static, api)
                '*': `http://${opts.server.host}:${opts.server.port}/`
            },
            
            stats: 'minimal'
        });

        server.listen(opts.devServer.port, opts.devServer.host, function(err) {
            if (err) {
                throw err;
            }

            gutil.log(gutil.colors.bgRed(
                `'[webpack-dev-server]' Listening at ` +
                `${opts.devServer.host}:${opts.devServer.port}`
            ));
        });
    }

    return promise;
}

module.exports = {
    getPackConfig,
    pack
};