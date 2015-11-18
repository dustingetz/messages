var path = require('path');
var webpack = require('webpack');


module.exports = {
  devtool: 'inline-source-map',
  entry: [
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin()
  ],

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
  }
};
