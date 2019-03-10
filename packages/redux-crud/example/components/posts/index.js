import crud from '@frontops/redux-crud'
import store from '@/store'

const posts = crud('posts')
store.addReducer({ posts })

console.log(posts.selectors(store.getState()).list())
const testPost = {
  id: 'test',
  name: 'Test name'
}
store.dispatch(
  posts.actions.create(testPost)
)
console.log(posts.selectors(store.getState()).list())
store.dispatch(
  posts.actions.read(testPost.id)
)
