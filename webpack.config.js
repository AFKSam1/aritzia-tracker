const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        'js/background': './src/js/background.js',
        'js/content': './src/js/content.js',
        'js/popup/popup': './src/js/popup/popup.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
},
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'] // Replace 'style-loader' with MiniCssExtractPlugin.loader
      },
      // If you want to load images:
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img'
            }
          }
        ]
      },
      // If you're using the popup.html and want to handle it through Webpack:
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  },
  mode: 'development',
  plugins: [
    // ... other plugins ...

    new CopyWebpackPlugin({
        patterns: [
            { from: 'manifest.json', to: '.' },  // copy manifest.json to the output directory
            { from: 'src/js/popup/popup.html', to: './js/popup' }, // if your popup uses an HTML file
            { from: 'src/styles/output.css', to: './styles' }
            // Add any other static assets that need to be copied here
        ],
    }),
    
    new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
        chunkFilename: 'styles/[id].css',
      }),
  ],
  devtool: 'source-map',
};
