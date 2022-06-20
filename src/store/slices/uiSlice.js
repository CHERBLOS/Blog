/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isLoading: false,
    isError: false,
  },
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload
    },
    setError(state, action) {
      state.isLoading = action.payload
    },
  },
})

export const { setError, setLoading } = uiSlice.actions
export default uiSlice.reducer
