# BaCayOnline
An online three-card poker game application that allows a maximum of 10 players to play on one table.

## Features
#### 1. Login with Facebook, Google, and JWT Authentication
- Users can log in using their Facebook or Google accounts.
- Implements JSON Web Token (JWT) authentication for secure user authentication and authorization.
#### 2. Create Game Rooms
- Users can create game rooms with or without passwords.
- Provide options to set the minimum betting amount and the number of players allowed in the room.
#### 3. Filter Game Rooms
- Users can filter game rooms based on criteria such as the number of players and the minimum betting amount.
- This feature helps users find the desired game rooms to join.
#### 4. In-Game Chat
- Users can chat within the game room during gameplay.
- Enable real-time communication and interaction among players.
#### 5. Global Chat
- Users can engage in conversations in a global chat room.
- Allow players to communicate with each other outside of specific game rooms.
#### 6. User Profile Management
- Users can modify and update their personal information.
- Provide options to change profile picture, nickname, and other profile details.

## Dependencies
- [React Native](https://reactnative.dev/) : A cross-platform framework for building mobile applications.
- [Socket.IO](https://socket.io/docs/v4/client-api/) : Enables real-time communication between the client and server.
- [React Redux](https://react-redux.js.org/) : Manages the state of the application.
- [Google Login](https://developers.google.com/identity/protocols/oauth2) : Allows users to log in using their Google accounts.
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/) : Allows users to log in using their Facebook accounts.

## Server
- As this is an online game, it will have a server to handle client requests.
- The source code of the server is also provided [here](https://github.com/LuongCuong244/Three-Card-Poker-Server).

