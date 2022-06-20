import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import articleSlice from './slices/articleSlice'
import uiSlice from './slices/uiSlice'
import userSlice from './slices/userSlice'

const store = configureStore({
  reducer: { article: articleSlice, ui: uiSlice, user: userSlice },
  middleware: [thunk],
})

export default store
