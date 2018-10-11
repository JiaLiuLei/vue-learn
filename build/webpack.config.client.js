const path = require('path'); //nodejs里面的基本包，处理路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const webpackMerge = require('webpack-merge');

const isDev = process.env.NODE_ENV === 'development';

const defaultPlugins = [
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: isDev ? '"development"' : '"production"'
		}
	}),
	new HtmlWebpackPlugin({
		title: 'home'
	})
]

const devServer = {
	port: 8080,
	host: '0.0.0.0',
	contentBase: '../dist',
	overlay: {
		errors: true
	},
	hot: true
}

let config

// 判断环境
if (isDev) {

	config = webpackMerge(baseConfig, {
		devtool: '#cheap-module-eval-source-map',
		module: {
			rules: [
				{
					test: /\.styl/,
					use: [
						'vue-style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true
							}
						},
						'stylus-loader'
					]
				}
			]
		},
		devServer,
		plugins: defaultPlugins.concat([
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin(),
    		new webpack.NoEmitOnErrorsPlugin()
		])
	})

} else {

	config = webpackMerge(baseConfig, {

		entry: {
			app: path.join(__dirname, '../client/index.js'),
			vendor: ['vue']
		},

		output: {
			filename: '[name].[chunkhash:8].js'
		},

		module: {
			rules: [
				{
					test: /\.styl/,
					use: ExtractTextWebpackPlugin.extract({
						fallback: 'vue-style-loader',
						use: [
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									sourceMap: true
								}
							},
							'stylus-loader'
						]
					})
				}
			]
		},

		plugins: defaultPlugins.concat([
			new ExtractTextWebpackPlugin('styles.[contentHash:8].css'),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'runtime'
			})
		])
	})
}

module.exports = config;
