import { configureStore, combineReducers } from '@reduxjs/toolkit'
import reducers from '@reducers'

const combineReducer = combineReducers({ ...reducers })

const getStore = (preloadedState = {}) => {
  return configureStore({
    reducer: combineReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // 忽略某些 action 的序列化检查
          ignoredActions: ['REQUEST_QUERY'],
        },
      })
  })
}

export default getStore
