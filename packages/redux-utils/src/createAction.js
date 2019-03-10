/**
 *
 * @param {string} type
 * @param [keys]
 * @return function
 */
export function createAction (type, keys = ['id', 'payload']) {
  return (...props) => {
    return {
      type,
      ...props
    }
  }
}
