import { createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import profileReducer from './reducers/profileReducer'
import authReducer from './reducers/authReducer'
import classroomReducer from './reducers/classroomReducer'
import courseReducer from './reducers/courseReducer'
import questionReducer from './reducers/questionReducer'
import quizReducer from './reducers/quizReducer'
import classReducer from "./reducers/classReducer";
import assignmentReducer from "./reducers/assignmentReducer"
import historyReducer from "./reducers/historyReducer"

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
  profileReducer,
  authReducer,
  classroomReducer,
  courseReducer,
  questionReducer,
  quizReducer,
  classReducer,
  assignmentReducer,
  historyReducer
})

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    // if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]))
}

export const wrapper = createWrapper(initStore)