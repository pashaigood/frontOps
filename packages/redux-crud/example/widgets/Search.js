import React from 'react'

const Style = {
  input: {
    display: 'block'
  }
}

/**
 *
 * @param {ImMap<InitialState.filter>} filter
 * @param onSubmit
 * @return {*}
 */
export default ({ filter, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Search:
        <input style={Style.input} value={filter.get('search')} onChange={onChange} type="text" />
      </label>
    </form>
  )
}
