const path = require('path')
const node_env = process.env.NODE_ENV? process.env.NODE_ENV: 'production'
// const CopyPlugin = require('copy-webpack-plugin')
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')

module.exports = {
  name: 'eee',
  mode: node_env,
  devtool: node_env === 'production'? 'source-map': 'inline-source-map',
  entry: {
    login: './src/login',
    main: './src/main',
    edit: './src/edit',
    new: './src/new',
    // 'dovepay-notificationCenter': './dovepay-notificationCenter'
  },
  output: {
    // clean: true,
    path: path.resolve(__dirname, 'release')
  },
  plugins: [
  //   new CopyPlugin({
  //     patterns: [{
  //       from: path.resolve(__dirname, 'node_modules/tinymce'),
  //       to: path.resolve(__dirname, 'libs/tinymce')
  //     },{
  //       from: path.resolve(__dirname, 'src/langs'),
  //       to: path.resolve(__dirname, 'libs/tinymce/langs')
  //     },{
  //       from: path.resolve(__dirname, 'src/favicon.ico'),
  //       to: path.resolve(__dirname, 'libs/favicon.ico')
  //     },{
  //       from: path.resolve(__dirname, 'node_modules/uikit/dist/css'),
  //       to: path.resolve(__dirname, 'libs/uikit/css')
  //     },{
  //       from: path.resolve(__dirname, 'src/password/libs'),
  //       to: path.resolve(__dirname, 'libs/password')
  //     },{
  //       from: path.resolve(__dirname, 'src/preload'),
  //       to: path.resolve(__dirname, 'libs/preload')
  //     }]
  //   })
    new ProgressBarWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '...']
  }
}