import { fork, spawn } from 'child_process';
import AutoInstaller, {AutoInstallerProps, AutoInstallerMessageTypes} from './AutoInstaller'

export { AutoInstallerProps, AutoInstallerMessageTypes }

export default (requiredModule: string, props: AutoInstallerProps): AutoInstaller => {
  return new AutoInstaller(requiredModule, props);
}
