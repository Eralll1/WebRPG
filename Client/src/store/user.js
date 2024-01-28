import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user',

  initialState:{
    first_name:"",
    user_name:"",
    is_authed:false,
    token:"",
    owned_room:"",
  },

  reducers: {
    login(state,action){
        state.is_authed = true;
        state.first_name = action.payload.first_name
        state.user_name = action.payload.user_name
        state.token = action.payload.token
        state.owned_room = action.payload.owned_room
    },
    create_room(state,action){
        state.owned_room = action.payload.owned_room
    },
    unlogin(state,action){
        state.is_authed = false;
        state.first_name = ""
        state.user_name = ""
        state.token = ""
        state.owned_room = ""
    },
    remove_room(state,action){
        state.owned_room = ""
    },
    
  },
})

export const { login, unlogin, create_room, remove_room} = UserSlice.actions

export const UserReducer = UserSlice.reducer

