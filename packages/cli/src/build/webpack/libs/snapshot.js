const jsdom = require('jsdom')
const Script = require('vm').Script

module.exports = function snapshot (options) {
  const HTML = options.html
  const PAGE = new jsdom.JSDOM(HTML, {
    runScripts: 'dangerously',
    virtualConsole: new jsdom.VirtualConsole()
  })

  if (options.loadAsset !== void 0) {

    for (var i = 0; i < PAGE.window.document.scripts.length; i++) {
      (function () {
        const script = PAGE.window.document.scripts[i]
        var source

        if (script.src !== void 0) {
          if ((source = options.loadAsset(script.src)) !== void 0) {
            PAGE.runVMScript(new Script(source))
          }
        }
      })()
    }
  }

  return PAGE.serialize()
}
