import Promise from 'bluebird';
import fs from 'packages/cli/src/build/webpack/plugins/autodll-webpack-plugin/src/utils/fs';

import _mkdirp from 'mkdirp';

export const mkdirp = Promise.promisify(_mkdirp);
export default Promise.promisifyAll(fs);
