const path = require("path");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = {
	entry: "./src/client/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	optimization: {
		minimize: false,
	},
	plugins: [new WebpackObfuscator({ target: "node" })],
	resolve: {
		extensions: [".ts", ".ts", ".js"],
	},
	output: {
		filename: "client.js",
		path: path.resolve("../hoyame/dist/client"),
	},
};
