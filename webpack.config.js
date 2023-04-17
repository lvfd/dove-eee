const path = require('path')
const node_env = process.env.NODE_ENV? process.env.NODE_ENV: 'production'
// const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  name: 'eee',
  mode: node_env,
  devtool: node_env === 'production'? 'source-map': 'inline-source-map',
  entry: {
    login: './src/login.js',
    main: './src/main.js',
    edit: './src/edit.js',
    new: './src/new.js'
  },
  output: {
    // clean: true,
    path: path.resolve(__dirname, 'release')
  },
  // plugins: [
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
  //     }]
  //   })
  // ]
}