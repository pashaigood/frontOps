import path from 'path'
import * as paths from 'common/constants/paths'
import * as Config from 'common/constants/Config'
import ExpressionTest from 'common/constants/Expressions'
import autoprefixer from 'autoprefixer'

export default ({development = true}) => context => {
  const style = [
    'style-loader',
    // sourceMap like query for happypack
    'css-loader?' + JSON.stringify({sourceMap: development, minimize: !development}), // translates CSS into CommonJS,
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: development,
        plugins: [
          autoprefixer({
            browsers: Config.browsers,
            remove: !development
          })
        ]
      }
    }
  ]

  return {
    module: {
      rules: [
        {
          test: ExpressionTest.CSS,
          use: style
        },
        {
          test: ExpressionTest.SCSS,
          use: style.concat(
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: {
                sourceMap: development,
                outputStyle: 'expanded',
                includePaths: [
                  paths.SOURCE,
                  path.join(paths.SOURCE, 'common/node_modules/bootstrap-sass/assets/stylesheets'),
                  './'
                ]
              }
            }
          )
        }]
    }
  }
}
