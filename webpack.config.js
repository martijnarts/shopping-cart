var path = require('path');
var describe = require('git-describe').gitDescribeSync;
var webpack = require('webpack');

var OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DedupePlugin = webpack.optimize.DedupePlugin;
var DefinePlugin = webpack.DefinePlugin;


module.exports = {
    devtool: 'source-map',
    context: __dirname,
    stats: {
        colors: true,
        reasons: true
    },

    entry: {
        'angular2': [
            'zone.js',
            'reflect-metadata',

            'angular2/angular2',
            'angular2/core',
            'angular2/router',
            'angular2/http'
        ],
        'app': [
            './src/app/bootstrap'
        ]
    },

    output: {
        path: path.join(__dirname, 'dist', 'js'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.ts', '.js', '.json']
    },

    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw' },
            {
                test: /\.ts$/,
                loader: 'ts',
                exclude: [
                    /\.min\.js$/,
                    /\.spec\.ts$/,
                    /\.e2e\.ts$/,
                    /node_modules/
                ],
            }
        ],
        noParse: [
            /rtts_assert\/src\/rtts_assert/,
            /reflect-metadata/
        ]
    },

    plugins: [
        new DefinePlugin({
            'VERSION': describe().raw
        }),
        new OccurenceOrderPlugin(),
        new DedupePlugin(),
        new CommonsChunkPlugin({
            name: 'angular2',
            minChunks: Infinity,
            filename: 'angular2.js'
        })
    ],

    node: {
        crypto: false,
        __filename: true
    }
};
