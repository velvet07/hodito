const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    main: './src/main.tsx',
    war: './src/war.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash].min.js' : '[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false
            }
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: 'index.html',
      chunks: ['main'],
      minify: isProduction
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/war.html',
      filename: 'war.html',
      chunks: ['war'],
      minify: isProduction
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/docs/buildings-guide.html',
      filename: 'docs/buildings-guide.html',
      chunks: [],
      minify: isProduction
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/docs/war-guide.html',
      filename: 'docs/war-guide.html',
      chunks: [],
      minify: isProduction
    }),
    ...(isProduction ? [
      new WebpackObfuscator({
        rotateStringArray: true,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ['base64'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 4,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false,
        selfDefending: true,
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        target: 'browser'
      }, ['**/node_modules/**'])
    ] : [])
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist')
      },
      {
        directory: path.join(__dirname, 'src/templates/docs'),
        publicPath: '/docs'
      }
    ],
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  devtool: isProduction ? false : 'source-map'
};

