import { createSlice } from '@reduxjs/toolkit'

export const roomSlice = createSlice({
    name: 'room',
    initialState: {
        roomName: null,
        position: null,
        playerKey: null,
        ownerOfRoom: null,
        firstPlayer: null,
        secondPlayer: null,
        thirdPlayer: null,
        fourthPlayer: null,
        fifthPlayer: null,
        sixthPlayer: null,
        seventhPlayer: null,
        eighthPlayer: null,
        ninthPlayer: null,
    },
    reducers: {
        resetRoomState: (state) => {
            state.roomName = null;
            state.position = null;
            state.ownerOfRoom = null;
            state.firstPlayer = null;
            state.secondPlayer = null;
            state.thirdPlayer = null;
            state.fourthPlayer = null;
            state.fifthPlayer = null;
            state.sixthPlayer = null;
            state.seventhPlayer = null;
            state.eighthPlayer = null;
            state.ninthPlayer = null;
        },
        playerInRoomUpdated: (state, action) => {
            const key = Object.keys(action.payload)[0];
            state[key] = action.payload[key];
        },
        setRoom: (state, action) => {
            state.ownerOfRoom = action.payload.ownerOfRoom || null;
            state.firstPlayer = action.payload.firstPlayer || null;
            state.secondPlayer = action.payload.secondPlayer || null;
            state.thirdPlayer = action.payload.thirdPlayer || null;
            state.fourthPlayer = action.payload.fourthPlayer || null;
            state.fifthPlayer = action.payload.fifthPlayer || null;
            state.sixthPlayer = action.payload.sixthPlayer || null;
            state.seventhPlayer = action.payload.seventhPlayer || null;
            state.eighthPlayer = action.payload.eighthPlayer || null;
            state.ninthPlayer = action.payload.ninthPlayer || null;
        },
        setPlayerKey: (state, action) => {
            switch (action.payload) {
                case 'firstPlayer':
                    state.position = 1;
                    break;
                case 'secondPlayer':
                    state.position = 2;
                    break;
                case 'thirdPlayer':
                    state.position = 3;
                    break;
                case 'fourthPlayer':
                    state.position = 4;
                    break;
                case 'fifthPlayer':
                    state.position = 5;
                    break;
                case 'sixthPlayer':
                    state.position = 6;
                    break;
                case 'seventhPlayer':
                    state.position = 7;
                    break;
                case 'eighthPlayer':
                    state.position = 8;
                    break;
                case 'ninthPlayer':
                    state.position = 9;
                    break;
                case 'ownerOfRoom':
                    state.position = 10;
                    break;
            }
            state.playerKey = action.payload;
        },
        setPosition: (state, action) => {
            switch (action.payload) {
                case 1:
                    state.playerKey = 'firstPlayer'
                    break;
                case 2:
                    state.playerKey = 'secondPlayer'
                    break;
                case 3:
                    state.playerKey = 'thirdPlayer'
                    break;
                case 4:
                    state.playerKey = 'fourthPlayer'
                    break;
                case 5:
                    state.playerKey = 'fifthPlayer'
                    break;
                case 6:
                    state.playerKey = 'sixthPlayer'
                    break;
                case 7:
                    state.playerKey = 'seventhPlayer'
                    break;
                case 8:
                    state.playerKey = 'eighthPlayer'
                    break;
                case 9:
                    state.playerKey = 'ninthPlayer'
                    break;
                case 10:
                    state.playerKey = 'ownerOfRoom'
                    break;
            }
            state.position = action.payload || null;
        },
        setUserNull: (state, action) => {
            state[action.payload] = null;
        },
        setRoomName: (state, action) => {
            state.roomName = action.payload || null;
        },
    },
})

export const { setRoom, setRoomName, setUserNull, setPosition, setPlayerKey, resetRoomState, playerInRoomUpdated } = roomSlice.actions

export const selectRoom = (state) => state.room

export default roomSlice.reducer
