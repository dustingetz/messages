var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');


const devBuild = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: [
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: _.compact([
    new webpack.NoErrorsPlugin(),
    devBuild ? null : new webpack.optimize.UglifyJsPlugin()
  ]),

  resolve: {
    extensions: ['', '.js'],
    root: [
      path.resolve('./src')
    ],
    modulesDirectories: [
      'node_modules'
    ],
    alias: {
      'react-chatview': path.join(__dirname, 'vendor/react-chatview/src/react-chatview'),
    }
  },

  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], include: [path.join(__dirname, 'src'), path.join(__dirname, 'vendor')] },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: require.resolve('moment'), loader: 'expose?moment' },
      { test: /node_modules\/react-cursor/, loader: 'babel' }
    ]
  },

  devtool: devBuild ? 'eval-cheap-module-source-map' : undefined
};
