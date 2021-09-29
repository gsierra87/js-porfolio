const path = require("path"); /* Esto permite obtener la ruta del proyecto */
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"), /* Directorio final para publicar */
        filename: "[name].[contenthash].js", /* Archivo final que se genera después de compilar */
        assetModuleFilename: 'assets/images/[hash][ext][query]' /* Va a mover las imagenes al directorio especificado y con el nombre especificado */
    },
    resolve: {
        extensions: [".js"],
        alias: {
            '@utils':path.resolve(__dirname,'src/utils/'),
            '@templates':path.resolve(__dirname,'src/templates/'),
            '@styles':path.resolve(__dirname,'src/styles/'),
            '@images':path.resolve(__dirname,'src/assets/images/')
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
            {
                test: /\.png/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2)$/, /* Todos los archivos .woff y .woff2 */
                use: {
                    loader: 'url-loader', /* El plugin */
                    options:{
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[contenthash].[ext]",
                        outputPath: "./assets/fonts/",
                        publicPath: "../assets/fonts/",
                        esModule: false,
                    }
                }
            }
       ]
   },
   plugins: [
       new HtmlWebPackPlugin({
           inject: true, /* Habilita la insersión en el HTML */
           template: "./public/index.html", /* Archivo HTML de origen */
           filename: "./index.html" /* Archibo HTML destino */
       }),
       new MiniCssExtractPlugin({
           filename: 'assets/[name].[contenthash].css'
       }),
       new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src", "assets/images"),
            to: "assets/images"
          }
        ]
      }),
      new Dotenv(),
      new CleanWebpackPlugin(),
   ],
   optimization: {
       minimize: true,
       minimizer: [
           new CssMinimizerPlugin(),
           new TerserPlugin(),
       ]
   }
}