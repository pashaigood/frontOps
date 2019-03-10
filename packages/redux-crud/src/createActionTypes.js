/**
 *
 * @param name
 * @return {*}
 */
export default name => {
  const getName = action => `${name}/${action}`

  return {
    LIST: getName('LIST'),
    CREATE: getName('CREATE'),
    READ: getName('READ'),
    UPDATE: getName('UPDATE'),
    REMOVE: getName('REMOVE')
  }
}
