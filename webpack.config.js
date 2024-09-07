/**
 * @import {Options} from '@mdx-js/loader'
 * @import {Configuration} from 'webpack'
 */

/** @type {Configuration} */
const webpackConfig = {
  module: {
    // …
    rules: [
      // …
      {
        test: /\.mdx?$/,
        use: [
          {
            loader: '@mdx-js/loader',
            /** @type {Options} */
            options: {
              /* jsxImportSource: …, otherOptions… */
            },
          },
        ],
      },
    ],
  },
}

export default webpackConfig
