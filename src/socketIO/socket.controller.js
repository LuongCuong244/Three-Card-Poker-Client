import socket from '../config/socket.config';

exports.playerHasConnected = (userName) => {
    return socket.emit('player_Has_Connected', userName);
}

// exports.userReconnect = (roomName, userName, playerKey) => {
//     return socket.emit('user_reconnect', roomName, userName, playerKey);
// }

exports.joinRoom = (roomName) => {
    return socket.emit('join_Room', roomName);
}

exports.updateRooms = () => {
    return socket.emit('update_Rooms');
}

exports.reloadRoom = (roomName, data) => {
    return socket.emit('req_Set_Position', roomName, data);
}

exports.reqSetPosition = (position) => {
    return socket.emit('req_Set_Position', position);
}

exports.resetReadyCounter = (roomName, data) => {
    return socket.emit('reset_Ready_Counter', roomName, data);
}

exports.countDownNewGame = (roomName) => {
    return socket.emit('countdown_Of_New_Game', roomName);
}

exports.getMesWorldChat = () => {
    return socket.emit('get_messages_world_chat');
}

exports.sendMessToWorldChat = (message) => {
    return socket.emit('sending_message_to_world_chat', message);
}

exports.getRoomMessage = (roomName) => {
    return socket.emit('get_all_mes_chat_room', roomName);
}

exports.sendMessToRoom = (message, roomName) => {
    return socket.emit('sending_message_to_room' ,message, roomName);
}

exports.startGame = (roomName) => {
    return socket.emit('start_Game', roomName);
}

exports.ready = (roomName, playerKey) => {
    return socket.emit('ready', roomName, playerKey);
}

exports.setRoomOwner = (roomName, position) => {
    return socket.emit('set_Owner_Room', roomName, position);
}

exports.flipCard = (roomName, cardOder, playerKey) => {
    return socket.emit('flip_Card', roomName, cardOder, playerKey);
}

exports.updateChangeBet = (roomName, playerKey) => {
    return socket.emit('update_Change_Bet', roomName, playerKey);
}

exports.leaveRoom = (roomName, userName) => {
    return socket.emit('leave_Room', roomName, userName);
}