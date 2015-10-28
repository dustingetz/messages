var path = require('path');
var webpack = require('webpack');


module.exports = {
  devtool: 'inline-source-map',
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    //'webpack/hot/only-dev-server',
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.resolve('./src')
    ],
    modulesDirectories: [
      'node_modules'
    ],
    alias: {
      'react-infinite': path.join(__dirname, 'vendor/react-infinite/src/react-infinite2'),
    }
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel'], include: [path.join(__dirname, 'src'), path.join(__dirname, 'vendor')] },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: require.resolve('moment'), loader: 'expose?moment' }
    ]
  }
};
