import crateActionTypes from './createActionTypes'

/**
 *
 * @param name
 * @return {*}
 */
export default name => {
  const ActionTypes = crateActionTypes(name)

  return {
    list (payload) {
      return {
        type: ActionTypes.LIST,
        payload
      }
    },

    read (id) {
      return {
        type: ActionTypes.READ,
        id
      }
    },

    create (payload) {
      return {
        type: ActionTypes.CREATE,
        payload
      }
    },

    update (id, payload) {
      return {
        type: ActionTypes.UPDATE,
        payload
      }
    },

    remove (id) {
      return {
        type: ActionTypes.REMOVE,
        id
      }
    }
  }
}
