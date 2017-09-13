// webpack rules by name
'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const DATA_URL_BYTE_LIMIT = 8192

module.exports = {
  // babel loader for JSX
  babel: {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }
  },

  // worker loader for inline webworkers
  worker: {
    test: /worker.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'worker-loader',
      options: {
        inline: true,
        fallback: false
      }
    }
  },

  // global CSS files
  globalCss: {
    test: /\.global\.css$/,
    use: ExtractTextPlugin.extract({
      use: 'css-loader',
      fallback: 'style-loader'
    })
  },

  // local CSS (CSS module) files
  localCss: {
    test: /^((?!\.global).)*\.css$/,
    use: ExtractTextPlugin.extract({
      use: {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: true,
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      }
    })
  },

  // fonts
  // TODO(mc, 2017-09-12): Add other font-types to the regex if we need them
  fonts: {
    test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: DATA_URL_BYTE_LIMIT
      }
    }
  },

  // common image formats (url loader)
  images: {
    test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: DATA_URL_BYTE_LIMIT
      }
    }
  }
}
