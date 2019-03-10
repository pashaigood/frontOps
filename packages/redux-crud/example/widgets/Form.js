import React from 'react'

const Style = {
  input: {
    display: 'block'
  }
}

export default ({ model, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Title:
        <input style={Style.input} type="text"/>
      </label>
    </form>
  )
}
