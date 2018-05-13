import { fork, spawn } from 'child_process';
import _defaults from 'lodash/defaults'

const notFoundModule: RegExp = new RegExp(`Error: Cannot find module '(.+?)'`);

declare type Stream = {
  write: Function,
  on: Function
}

declare type Process = {
  stdout: Stream,
  stderr: Stream,
  kill: Function
}

declare type AutoInstallerProps = {
  process?: Process,
  debug?: boolean
}

export enum AutoInstallerMessageTypes {
  START,
  RESTART,
  BEFORE_INSTALL,
  INSTALL,
  ERROR
}

declare type AutoInstallerMessage = {
  type: AutoInstallerMessageTypes,
  payload?: any
}

export default class AutoInstaller {
  private debug: boolean;
  private process: Process;
  private watcher: Process;
  private installProps: [string];
  requiredModule: string;

  constructor(requiredModule: string, props: AutoInstallerProps = {}) {
    this.requiredModule = requiredModule;

    Object.assign(this, _defaults(props, {
      process,
      installProps: []
    }));

    this.start();
  }

  start () {
    const watcher = this.watcher = fork(this.requiredModule, {
      stdio: [0, 1, 'pipe', 'ipc']
    });

    watcher.stderr.on('data', (chunk) => {
      const error: string = chunk.toString();
      const [f, moduleName] = error.match(notFoundModule);

      if (moduleName) {
        this.install(moduleName);
      } else {
        this.process.stderr.write(chunk);
      }
    });

    return watcher
  }

  restart () {
    this.watcher.kill();
    this.message({
      type: AutoInstallerMessageTypes.RESTART
    });
    this.start()
  }

  install (moduleName) {
    this.message({
      type: AutoInstallerMessageTypes.BEFORE_INSTALL,
      payload: moduleName
    });
    spawn('npm', ['install', moduleName].concat(this.installProps), {
      stdio: !this.debug ? 'pipe' : 'inherit'
    })
      .on('exit', (code, signal) => {
        if (code === 1) {
          this.message({
            type: AutoInstallerMessageTypes.ERROR,
            payload: moduleName
          });
          this.watcher.kill();
          this.message({
            type: AutoInstallerMessageTypes.ERROR,
            payload: moduleName
          });
        } else {
          this.message({
            type: AutoInstallerMessageTypes.INSTALL,
            payload: moduleName
          });
          this.restart();
        }
      });
  }

  onMessage (message: AutoInstallerMessage) {}

  private message (message: AutoInstallerMessage) {
    this.onMessage(message)
  }
}
