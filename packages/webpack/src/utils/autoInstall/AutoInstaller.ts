import {ChildProcess, fork, spawn} from 'child_process';

const notFoundModule: RegExp = new RegExp(`Error: Cannot find module '(.+?)'`);

declare type AutoInstallerProps = {
  process?: NodeJS.Process,
  debug?: boolean
}

export enum AutoInstallerMessageTypes {
  RESTART,
  BEFORE_INSTALL,
  INSTALL,
  ERROR,
  KILL
}

declare type AutoInstallerMessage = {
  type: AutoInstallerMessageTypes,
  payload?: any
}

const SIGNAL = 'SIGKILL';

export default class AutoInstaller {
  private killed: boolean = false;
  private debug: boolean = false;
  private process: NodeJS.Process = process;
  private watcher: ChildProcess;
  private installer: ChildProcess;
  private installProps: [string] = [];
  private requiredModule: string;

  constructor (requiredModule: string, props: AutoInstallerProps = {}) {
    this.requiredModule = requiredModule;

    Object.assign(this, props);

    this.start();
  }

  private start () {
    if (this.killed) {
      return false;
    }

    if (this.watcher) {
      this.watcher.kill(SIGNAL)
    }
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

  private restart () {
    if (this.killed) {
      return;
    }

    this.message({
      type: AutoInstallerMessageTypes.RESTART
    });
    this.start()
  }

  private install (moduleName) {
    if (this.killed) {
      return;
    }

    this.message({
      type: AutoInstallerMessageTypes.BEFORE_INSTALL,
      payload: moduleName
    });
    this.installer = spawn('npm', ['install', moduleName].concat(this.installProps), {
      stdio: !this.debug ? 'pipe' : 'inherit'
    })
      .on('exit', this.onInstallFinish.bind(this, moduleName));
  }

  private onInstallFinish (moduleName, code) {
    if (this.killed) {
      return;
    }

    if (code === 1) {
      this.kill();
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
  }

  private message (message: AutoInstallerMessage) {
    this.onMessage(message)
  }

  onMessage (message: AutoInstallerMessage) {}

  kill () {
    this.message({
      type: AutoInstallerMessageTypes.KILL
    });
    this.killed = true;
    this.watcher.kill(SIGNAL);
    this.installer && this.installer.kill(SIGNAL)
  }
}
