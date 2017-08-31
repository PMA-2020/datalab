// webpack.config.js
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: './source/javascripts/main.js',
    styles: './source/scss/main.scss'
  },

  plugins: [
    new ExtractTextPlugin('bundle.styles.css'),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Tether: 'tether',
    }),
  ],

  output: {
    path: __dirname + '/source/dist',
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader',
        query: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'file-loader',
        }],
      },
      { // Load support for ES6
        test: /source\/assets\/javascripts\/.*\.js$/,
        exclude: /node_modules|\.tmp|vendor/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        },
      },
      { // Load SASS pre processed CSS
        test: /\.scss$/,
        use: [  {
          loader: 'resolve-url-loader',
        }, {
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'sass-loader' // compiles SASS to CSS
        }],
      },
      { // Load plain-ol' vanilla CSS
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader!resolve-url-loader',
          use: 'css-loader!resolve-url-loader'
        })
      },
    ],
  }
};
