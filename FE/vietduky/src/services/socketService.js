import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export const connectToSocket = (userId) => {
  socket.emit('join', userId);
};

export const onNewNotification = (callback) => {
  socket.on('newNotification', callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket; 