var Path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'production';
var cssOutputPath = isProduction ? '/styles/app.[hash].css' : '/styles/app.css';
var jsOutputPath = isProduction ? '/scripts/app.[hash].js' : '/scripts/app.js';
var ExtractSASS = new ExtractTextPlugin(cssOutputPath);
var port = isProduction ? process.env.PORT || 8080 : process.env.PORT || 3000;

// ------------------------------------------
// Base
// ------------------------------------------
var webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    }),
    new HtmlWebpackPlugin({
      template: Path.join(__dirname, './src/index.html'),
    }),
  ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      include: Path.join(__dirname, './src/app'),
      loader: 'babel',
    }],
  },
};

// ------------------------------------------
// Entry points
// ------------------------------------------
webpackConfig.entry = !isProduction
  ? ['webpack-dev-server/client?http://localhost:' + port,
     'webpack/hot/dev-server',
     Path.join(__dirname, './src/app/index')]
  : [Path.join(__dirname, './src/app/index')];

// ------------------------------------------
// Bundle output
// ------------------------------------------
webpackConfig.output = {
  path: Path.join(__dirname, './dist'),
  filename: jsOutputPath,
};

// ------------------------------------------
// Devtool
// ------------------------------------------
webpackConfig.devtool = isProduction ? 'source-map' : 'cheap-eval-source-map';

// ------------------------------------------
// Module
// ------------------------------------------
isProduction
  ? webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loader: ExtractSASS.extract(['css', 'sass']),
    })
  : webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    });

webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?limit=65000&mimetype=application/font-woff&name=static/fonts/[name].[ext]' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=static/fonts/[name].[ext]' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?limit=65000&mimetype=application/octet-stream&name=static/fonts/[name].[ext]' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?limit=65000&mimetype=application/octet-stream&name=static/fonts/[name].[ext]' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?limit=65000&mimetype=application/vnd.ms-fontobject&name=static/fonts/[name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?limit=65000&mimetype=image/svg+xml&name=static/fonts/[name].[ext]' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192&name=static/images/[name].[ext]' }
);  

// ------------------------------------------
// Plugins
// ------------------------------------------
isProduction
  ? webpackConfig.plugins.push(
      new Webpack.optimize.OccurenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
      }),
      ExtractSASS
    )
  : webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

// ------------------------------------------
// Development server
// ------------------------------------------
if (!isProduction) {
  webpackConfig.devServer = {
    contentBase: Path.join(__dirname, './'),
    hot: true,
    port: port,
    inline: true,
    progress: true,
    historyApiFallback: true,
  };
}

module.exports = webpackConfig;