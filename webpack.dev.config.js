const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, './src'),
    },
    port: 8888,
    hot: true,
    open: true,
    liveReload: true,
  },
};
