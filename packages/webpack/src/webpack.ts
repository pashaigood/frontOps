import webpack from 'webpack'
import config from 'factories/config'

webpack(config(), () => {
  console.log('finish')
});
