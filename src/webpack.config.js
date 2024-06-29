const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.js", // Điểm vào của ứng dụng React
  output: {
    filename: "bundle.js", // Tên của file đầu ra
    path: path.resolve(__dirname, "dist"), // Thư mục chứa file đầu ra
    clean: true, // Làm sạch thư mục đầu ra trước khi build
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Áp dụng cho các file .js và .jsx
        exclude: /node_modules/, // Bỏ qua thư mục node_modules
        use: {
          loader: "babel-loader", // Sử dụng babel-loader
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Sử dụng preset-env và preset-react
          },
        },
      },
      {
        test: /\.css$/, // Áp dụng cho các file .css
        use: ["style-loader", "css-loader"], // Sử dụng style-loader và css-loader
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Tự động thêm phần mở rộng khi import
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Template HTML
    }),
    new Dotenv(), // Sử dụng dotenv-webpack
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"), // Thư mục phục vụ
    compress: true, // Bật gzip compression
    port: 3000, // Cổng server
    hot: true, // Bật Hot Module Replacement
  },
};
