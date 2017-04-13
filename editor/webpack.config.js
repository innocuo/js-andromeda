var path = require('path');

module.exports = {
    entry: './src/js/main.js',
    devtool: 'source-map',
    resolve:{
      modules: [path.resolve(__dirname, "src/js"), "node_modules"],
      extensions: ['*','.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
