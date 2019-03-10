import React from 'react'
import Search from './Search'
import List from './List'

export default ({ filter, list, pagination, actions = {} }) => {
  return (
    <div>
      <Search filter={filter} onSubmit={actions.onSubmit} />
      <List list={list} pagination={pagination} />
    </div>
  )
}
