import path from "path";
import resolve from "resolve";
import findup from "findup-sync";
import unique from "array-unique";
import fastGlob from "fast-glob";
import micromatch from "micromatch";

export default {
  fromLocal,
  fromModules
}

const PACKAGE_SCOPE: [string] = ['dependencies', 'devDependencies', 'peerDependencies'];
const PARENT_DIR = path.dirname(module.parent.filename);

declare type LoadPluginOptions = {
  pattern?: [string],
  DEBUG?: boolean,
  scope?: string|[string],
  replaceString?: RegExp,
  config?: Object
  overridePattern?: boolean,
  camelize?: boolean,
  requireFn?: Function,
  renameFn?: Function,
  rename?: Object,
  lazy?: boolean ,
  postRequireTransforms?: Object,
  maintainScope?: boolean
}

function fromLocal (options: LoadPluginOptions) {
  const scope = arrayify(options.scope);
  const names = scope.reduce((result: Array, folder: string) => {
    return result.concat(fastGlob.sync('**', {
      cwd: folder,
      deep: 1
    })).map(f => path.resolve(folder, f));
  }, []);

  return names.reduce((result, pluginPath) => {
    const name = path.dirname(pluginPath).split(path.sep).pop();
    result[camelize(name)] = require(pluginPath).default;
    return result;
  }, {})
}

function fromModules (options: LoadPluginOptions) {
  const finalObject = {};
  let configObject;
  let requireFn;
  options = options || {};

  const DEBUG = options.DEBUG || false;
  const pattern = getPattern(options);
  let config = options.config || findup('package.json', {cwd: PARENT_DIR});
  const scope = arrayify(options.scope || PACKAGE_SCOPE);
  const replaceString = options.replaceString || false;///^gulp(-|\.)/;
  const camelizePluginName = options.camelize !== false;
  const lazy = 'lazy' in options ? !!options.lazy : true;
  const renameObj = options.rename || {};
  const maintainScope = 'maintainScope' in options ? !!options.maintainScope : true;

  logDebug('Debug enabled with options: ' + JSON.stringify(options));

  const renameFn = options.renameFn || function (name) {
      name = replaceString && name.replace(replaceString, '') || name;
      return camelizePluginName ? camelize(name) : name;
    };

  const postRequireTransforms = options.postRequireTransforms || {};

  if (typeof options.requireFn === 'function') {
    requireFn = options.requireFn;
  } else if (typeof config === 'string') {
    requireFn = function (name) {
      // This searches up from the specified package.json file, making sure
      // the config option behaves as expected. See issue #56.
      const src = resolve.sync(name, {basedir: path.dirname(config)});
      return require(src);
    };
  } else {
    requireFn = require;
  }

  logDebug('node_modules plugins');
  configObject = (typeof config === 'string') ? require(config) : config;

  if (!configObject) {
    throw new Error('Could not find dependencies. Do you have a package.json file in your project?');
  }

  const names:[string] = scope.reduce(function (result, prop) {
    return result.concat(Object.keys(configObject[prop] || {}));
  }, []);


  logDebug(names.length + ' plugin(s) found: ' + names.join(' '));

  function logDebug(message) {
    if (DEBUG) {
      logger('plugins: ' + message);
    }
  }

  function defineProperty(object, transform, requireName, name, maintainScope) {
    let err;
    if (object[requireName]) {
      logDebug('error: defineProperty ' + name);
      err = maintainScope
        ? 'Could not define the property "' + requireName + '", you may have repeated dependencies in your package.json like' + ' "gulp-' + requireName + '" and ' + '"' + requireName + '"'
        : 'Could not define the property "' + requireName + '", you may have repeated a dependency in another scope like' + ' "gulp-' + requireName + '" and ' + '"@foo/gulp-' + requireName + '"';
      throw new Error(err);
    }

    if (lazy) {
      logDebug('lazyload: adding property ' + requireName);
      Object.defineProperty(object, requireName, {
        enumerable: true,
        get: function () {
          logDebug('lazyload: requiring ' + name + '...');
          return transform(requireName, requireFn(name));
        }
      });
    } else {
      logDebug('requiring ' + name + '...');
      object[requireName] = transform(requireName, requireFn(name));
    }
  }

  function getRequireName(name) {
    var requireName;

    if (renameObj[name]) {
      requireName = options.rename[name];
    } else {
      requireName = renameFn(name);
    }

    logDebug('renaming ' + name + ' to ' + requireName);

    return requireName;
  }

  function applyTransform(requireName, plugin) {
    var transform = postRequireTransforms[requireName];

    if (transform && typeof transform === 'function') { // if postRequireTransform function is passed, pass it the plugin and return it
      logDebug('transforming ' + requireName);
      return transform(plugin);
    } else {
      return plugin; // if no postRequireTransform function passed, return the plugin as is
    }
  }

  const scopeTest = new RegExp('^@');
  const scopeDecomposition = new RegExp('^@(.+)/(.+)');

  console.log(names, pattern, micromatch(names, pattern))

  unique(micromatch(names, pattern)).forEach(function (name) {
    let decomposition;
    let fObject = finalObject;
    if (scopeTest.test(name)) {
      decomposition = scopeDecomposition.exec(name);
      if (maintainScope) {
        if (!fObject.hasOwnProperty(decomposition[1])) {
          finalObject[decomposition[1]] = {};
        }
        fObject = finalObject[decomposition[1]];
      }

      defineProperty(fObject, applyTransform, getRequireName(decomposition[2]), name, maintainScope);
    } else {
      defineProperty(fObject, applyTransform, getRequireName(name), name, maintainScope);
    }
  });

  return finalObject;
}

function getPattern(options: LoadPluginOptions): [string] {
  const defaultPatterns = ['**'];
  const overridePattern = 'overridePattern' in options ? options.overridePattern : true;
  if (overridePattern) {
    return arrayify(options.pattern || defaultPatterns);
  }
  return defaultPatterns.concat(arrayify(options.pattern));
}

function arrayify(el) {
  return Array.isArray(el) ? el : [el];
}

function camelize(str) {
  return str.replace(/-(\w)/g, function (m, p1) {
    return p1.toUpperCase();
  });
}

function logger() {
  const fancylog = require('fancy-log');
  fancylog.apply(null, arguments);
}


// Necessary to get the current `module.parent` and resolve paths correctly.
delete require.cache[__filename];
