import { createSlice } from '@reduxjs/toolkit'
import cookies from '../services/cookies'

export const UserSlice = createSlice({
  name: 'user',

  initialState:{
    user: {first_name:"", user_name:"", is_authed:false, token:""}
  },

  reducers: {
    login(state,action) {
        state.user.is_authed = true;
        state.user.first_name = action.payload.first_name
        state.user.user_name = action.payload.user_name
        state.user.token = action.payload.token
    },
    
  },
})

export const { login, unlogin } = UserSlice.actions

export const UserReducer = UserSlice.reducer

