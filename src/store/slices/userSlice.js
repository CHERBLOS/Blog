/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth: false,
    user: null,
  },
  reducers: {
    setAuth(state, action) {
      state.isAuth = action.payload
    },
    setUser(state, action) {
      state.user = action.payload
    },
  },
})

export const { setAuth, setUser } = userSlice.actions
export default userSlice.reducer
