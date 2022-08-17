const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    // client: { overlay: false },
    port: 8000,
    open: false, // 打开浏览器，默认false
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: { '/api': '/' },
      },
    },
    historyApiFallback: true,
  },
  entry: {
    main: './src/main.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "static/js/main.[hash].chunk.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'swc-loader',
            options: {
              env: { mode: 'usage' },
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                  decorators: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    refresh: isDevelopment,
                    importSource: '@emotion/react',
                  },
                },
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                modifyVars: {
                  // 'primary-color': '#CF5659',
                  // 'link-color': '#CF5659'
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          filter: async (resourcePath) => {
            // 排除index.html
            if (resourcePath.includes('public/index.html')) {
              return false;
            }
            if (resourcePath.includes('public/index.pro.html')) {
              return false;
            }
            return true;
          },
        },
      ],
    }),
    isDevelopment && new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html',
    }),
  ].filter(Boolean),
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};
