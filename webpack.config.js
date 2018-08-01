const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./app/javascripts/app.js', './app/javascripts/game.js'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" }
    ]),

    // Copy the ethereum logo to the build folder.
    new CopyWebpackPlugin([
      { from: './app/ETHEREUM-ICON_Black_small.png', to: "ETHEREUM-ICON_Black_small.png" }
    ]),

    // Copy icon image to the build folder
    new CopyWebpackPlugin([
      { from: './app/Click-Play.png', to: 'Click-Play.png' }
    ]),

    // Copy gif animation to the build folder
    new CopyWebpackPlugin([
     { from: './app/tictactoe-robot.gif', to: 'tictactoe-robot.gif' }
    ]),
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
