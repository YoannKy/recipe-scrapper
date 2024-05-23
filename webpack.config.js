const path = require('path');

module.exports = {
  target: 'node',
  entry: {
    app: ['./src/main.ts'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, 'node_modules/validator/lib'),
        sideEffects: false,
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  externals: {
    phantombuster: 'commonjs2 phantombuster',
    puppeteer: 'commonjs2 puppeteer',
  },
  optimization: {
    minimize: false,
  },
};
