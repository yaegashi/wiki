const webpack = require('webpack')
const path = require('path')
const fs = require('fs-extra')
const yargs = require('yargs').argv
const _ = require('lodash')

const { VueLoaderPlugin } = require('vue-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const WebpackBarPlugin = require('webpackbar')

const babelConfig = fs.readJsonSync(path.join(process.cwd(), '.babelrc'))
const cacheDir = '.webpack-cache/cache'
const babelDir = path.join(process.cwd(), '.webpack-cache/babel')

process.noDeprecation = true

const theme = _.defaultTo(yargs.theme, 'default')

fs.emptyDirSync(path.join(process.cwd(), `assets/themes/${theme}`))

module.exports = {
  mode: 'production',
  entry: `./client/themes/${theme}/index.js`,
  output: {
    path: path.join(process.cwd(), `assets/themes/${theme}`),
    publicPath: `/themes/${theme}/`,
    filename: 'theme.js',
    chunkFilename: '[name].[chunkhash].js',
    globalObject: 'this',
    crossOriginLoading: 'use-credentials'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: (modulePath) => {
          return modulePath.includes('node_modules') && !modulePath.includes('vuetify')
        },
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: cacheDir
            }
          },
          {
            loader: 'babel-loader',
            options: {
              ...babelConfig,
              cacheDirectory: babelDir
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: cacheDir
            }
          },
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: cacheDir
            }
          },
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: false
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.join(process.cwd(), '/client/scss/global.scss')
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.pug$/,
        exclude: [
          path.join(process.cwd(), 'dev')
        ],
        loader: 'pug-plain-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        exclude: [
          path.join(process.cwd(), 'node_modules/grapesjs')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'svg/'
            }
          }
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'graphql-persisted-document-loader' },
          { loader: 'graphql-tag/loader' }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: [
          path.join(process.cwd(), 'client')
        ],
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new MomentTimezoneDataPlugin({
      startYear: 2017,
      endYear: (new Date().getFullYear()) + 5
    }),
    new MiniCssExtractPlugin({
      filename: 'theme.css',
      chunkFilename: '[name].[chunkhash].css'
    }),
    new WebpackBarPlugin({
      name: 'Theme Assets'
    }),
    new CleanWebpackPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    namedModules: true,
    namedChunks: true,
    runtimeChunk: false
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    symlinks: true,
    alias: {
      '@': path.join(process.cwd(), 'client'),
      'vue$': 'vue/dist/vue.esm.js',
      'gql': path.join(process.cwd(), 'client/graph'),
      // Duplicates fixes:
      'apollo-link': path.join(process.cwd(), 'node_modules/apollo-link'),
      'apollo-utilities': path.join(process.cwd(), 'node_modules/apollo-utilities'),
      'uc.micro': path.join(process.cwd(), 'node_modules/uc.micro')
    },
    extensions: [
      '.js',
      '.json',
      '.vue'
    ],
    modules: [
      'node_modules'
    ]
  },
  node: {
    fs: 'empty'
  },
  stats: {
    children: false,
    entrypoints: false
  },
  target: 'web'
}
