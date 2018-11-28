import path from 'path'

export const MODULES_DIR = 'node_modules'
export const SOURCE_DIR = process.env.SOURCE || 'src'
export const OUTPUT_DIR = process.env.OUTPUT || 'dist'
export const TMP_DIR = process.env.TMP || 'build'

export const DBS = path.resolve(__dirname, '../../../')
export const DBS_LIBS = path.resolve(__dirname, '../..')
export const CWD = path.join(process.cwd())
export const PROJECT = CWD // TODO: Make resolving of project root path.
export const BENCHMARK = path.join(DBS, 'benchmark')
export const BENCHMARK_RESULT = path.join(BENCHMARK, 'result')
export const SOURCE = path.join(CWD, SOURCE_DIR)
export const OUTPUT = path.join(CWD, OUTPUT_DIR)
export const DLL = path.join(OUTPUT, 'dll')
export const TMP = path.join(CWD, TMP_DIR)
export const PUBLIC = `/${process.env.PUBLIC_PATH || ''}/`.replace('//', '/')
export const COMMON = path.join(SOURCE, 'common')
export const MODULES_DBS = path.join(DBS, MODULES_DIR)
export const MODULES_COMMON = path.join(COMMON, MODULES_DIR)
export const MODULES = path.join(CWD, MODULES_DIR)
export const LAYOUTS = path.join(COMMON, 'layouts')
export const ALIASES = path.join(COMMON, 'aliases')
