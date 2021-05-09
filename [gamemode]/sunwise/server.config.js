const webpack = require("webpack");
const path = require("path")
const fivemPath = "./"

module.exports = {
  entry: "./src/server/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new webpack.DefinePlugin({ "global.GENTLY": false })],
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "server.js",
    path: path.resolve(fivemPath, "dist/server")
  },
  target: "node"
};
