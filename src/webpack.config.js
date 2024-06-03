const Dotenv = require("dotenv-webpack");

module.exports = {
  // Các cấu hình khác của webpack
  plugins: [new Dotenv()],
};
