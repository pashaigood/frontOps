/**
 *
 * @param module
 * @param {string} [postfix]
 * @return {function(string): string}
 */
export default function createType (module, postfix) {
  const prefix = module.i + postfix
  return (name) => `${prefix}/${name}`
}
