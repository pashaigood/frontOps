import React from 'react'

/**
 *
 * @param {Immutable.List<Immutable.Map>} list
 * @return {*}
 */
export default ({ list, pagination }) => {
  if (!list) {
    return (<div>loading...</div>)
  }
  if (!list.size) {
    return (<div>no items</div>)
  }

  const firstElement = list.get(0)
  const keys = firstElement.keySeq().toArray()

  return (
    <table>
      <thead>
        <tr>
          {keys.map(key => <th key={`th-${key}`}>{key}</th>)}
        </tr>
      </thead>
      <tbody>
        {list.map(element)}
      </tbody>
    </table>
  )
}

/**
 *
 * @param {Immutable.Map} element
 */
function element (element) {
  const keys = element.keySeq().toArray()

  return (
    <tr key={`row-${element.get('id')}`}>
      {keys.map(key => <td key={`td-${key}`}>{element.get(key)}</td>)}
    </tr>
  )
}
