const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "lib/umd.js"),
  output: {
    library: "lib0ui",
    libraryTarget: "umd",
    filename: "0ui.umd.js",
    path: path.resolve(__dirname, "dist")
  }
};
