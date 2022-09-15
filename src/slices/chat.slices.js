import { createSlice } from '@reduxjs/toolkit';
import { GiftedChat } from "react-native-gifted-chat/";

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatRoomMes: [],
        worldChatMes: [],
    },
    reducers: {
        addMesChatRoom: (state, action) => {
            state.chatRoomMes = GiftedChat.append(state.chatRoomMes, action.payload);
        },
        setChatRoomMes: (state, action) => {
            state.chatRoomMes = action.payload;
        },
        addMesWorldChat: (state, action) => {
            state.worldChatMes = GiftedChat.append(state.worldChatMes, action.payload);
        },
        setWorldChatMes: (state, action) => {
            state.worldChatMes = action.payload;
        },
    },
})

export const { setChatRoomMes, setWorldChatMes, addMesWorldChat, addMesChatRoom } = chatSlice.actions

export const selectChat = (state) => state.chat

export default chatSlice.reducer
