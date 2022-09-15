import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: null,
        email: null,
        avatar: null,
        coin: null,
        diamond: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
            state.coin = action.payload.coin;
            state.diamond = action.payload.diamond;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setCoin: (state, action) => {
            state.coin = action.payload;
        },
        setDiamond: (state, action) => {
            state.diamond = action.payload;
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload;
        },
    },
})

export const { setUser, setEmail, setCoin, setDiamond, setAvatar } = userSlice.actions

export const selectUser = (state) => state.user

export default userSlice.reducer
