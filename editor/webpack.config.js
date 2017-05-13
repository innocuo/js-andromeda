var path = require('path');

module.exports = {
    entry: './src/js/main.js',
    devtool: 'source-map',
    resolve:{
      modules: [path.resolve(__dirname, "src/js"), "node_modules"],
      extensions: ['*','.js'],
      alias: {
        vue: 'vue/dist/vue.js'
      }

    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',

          exclude: /node_modules/,
          query:{
            presets: ['es2015','stage-2']
          }
        }
      ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
