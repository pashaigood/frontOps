import { createStore as backendCreateStore } from 'redux'
import createStore, { createHotMiddleware } from '../createStore'

const hello = 'hello from middleware'

describe('createStore.js', () => {
  it('should create hot middleware', () => {
    const testAction = mockAction()
    const subAction = mockAction('sub-action')
    const subMarker = 'sub marker'
    let middleware = store => next => action => {
      if (action.type === testAction.type) {
        store.dispatch(subAction)
      }
      if (action.type === subAction.type) {
        action.payload = subMarker
      }
      return next(action)
    }
    middleware = fake(middleware)
    const reducer = fake(mockReducer())
    const enhancedCreateStore = createHotMiddleware([
      mockMiddleware(),
      middleware
    ])(
      backendCreateStore
    )
    const store = enhancedCreateStore(reducer)
    store.dispatch(testAction)
    expect(middleware).toHaveBeenCalled()
    expect(reducer).toHaveBeenCalled()
    expect(testAction.payload).toBe(hello)
    expect(subAction.payload).toBe(subMarker)
  })

  describe('Store', () => {
    let middleware, reducer, store
    beforeAll(() => {
      middleware = jasmine.createSpy('middleware').and.callFake(mockMiddleware())
      reducer = jasmine.createSpy('reducer').and.callFake(mockReducer())
      store = createStore({ reducer }, [middleware])
    })

    afterEach(() => {
      reducer.calls.reset()
      middleware.calls.reset()
      store = createStore({ reducer }, [middleware])
    })

    it('should create store', () => {
      const action = {
        type: 'test'
      }
      store.dispatch(action)
      expect(middleware).toHaveBeenCalled()
      expect(reducer).toHaveBeenCalled()
      expect(action.payload).toBe(hello)
    })

    it('should add reducer', () => {
      const testAction = mockAction()
      const testState = 'work'
      let hotReducer = (state = '', action) => action.type === testAction.type ? testState : state
      hotReducer = fake(hotReducer)

      store.addReducer({ hotReducer })
      store.dispatch(testAction)
      expect(hotReducer).toHaveBeenCalled()
      expect(store.getState().hotReducer).toBe(testState)
    })

    it('should add middleware', () => {
      const marker = 'hello from hot middleware!'
      const testAction = mockAction('addMiddleware')
      let middleware = store => next => action => {
        if (action.type === testAction.type) {
          action.payload = marker
        }
        next(action)
      }
      middleware = fake(middleware)
      store.addMiddleware(middleware)
      store.dispatch(testAction)
      expect(testAction.payload).toBe(marker)
    })
  })
})

const mockMiddleware = () => store => next => action => {
  action.payload = hello
  return next(action)
}

const mockReducer = () => (state = {}, action) => {
  return state
}

const mockAction = (type = 'test', props = {}) => ({
  type,
  ...props
})

function fake (f) {
  return jasmine.createSpy('n' + Math.random()).and.callFake(f)
}
