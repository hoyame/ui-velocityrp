const webpack = require("webpack");
const path = require("path");

module.exports = {
	entry: "./src/server/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new webpack.DefinePlugin({ "global.GENTLY": false })],
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
	},
	output: {
		filename: "server.js",
		path: path.resolve("../hoyame/dist/server"),
	},
	target: "node",
};
