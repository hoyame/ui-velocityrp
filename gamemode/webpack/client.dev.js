const path = require("path");

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
	resolve: {
		extensions: [".ts", ".ts", ".js"],
	},
	output: {
		filename: "client.js",
		path: path.resolve("./dist/client"),
	},
};
