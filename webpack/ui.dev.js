const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	entry: "./src/ui/index.tsx",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(css|scss)$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/u,
				use: "file-loader",
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|ogg|mp3)$/u,
				loader: "file-loader",
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
		new HtmlWebpackPlugin({
			template: "./src/ui/index.html",
			filename: "index.html",
		}),
		new CopyPlugin([
			{
				from: "src/ui/assets",
				to: "./",
			},
		]),
	],
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx", ".scss"],
	},
	devServer: {
		historyApiFallback: true,
	},
	output: {
		filename: "[name].js",
		publicPath: "",
		path: path.resolve("./dist/ui"),
	},
};
