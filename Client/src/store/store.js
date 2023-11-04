import { configureStore } from '@reduxjs/toolkit'
import { UserReducer } from './user'


const store = configureStore({
    devTools: true,
    reducer: {
        user: UserReducer
    }
})

export default store