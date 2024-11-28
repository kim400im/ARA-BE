// const { addUser, getUsersInRoom, removeUser, getUser } = require('../models/users');
// const { generateMessage } = require('../models/messages');

// module.exports = (io) => {
//   io.on('connection', (socket) => {
//     console.log('New WebSocket connection', socket.id);

//     socket.on('join', ({ username, room }, callback) => {
//       const { error, user } = addUser({ id: socket.id, username, room });

//       if (error) return callback(error);

//       socket.join(user.room);
//       socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다.`));
//       socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} 님이 입장하셨습니다.`));

//       io.to(user.room).emit('roomData', {
//         room: user.room,
//         users: getUsersInRoom(user.room),
//       });

//       callback();
//     });

//     socket.on('sendMessage', (message, callback) => {
//       const user = getUser(socket.id);

//       if (user) {
//         io.to(user.room).emit('message', generateMessage(user.username, message));
//       }

//       callback();
//     });

//     socket.on('disconnect', () => {
//       const user = removeUser(socket.id);

//       if (user) {
//         io.to(user.room).emit('message', generateMessage('Admin', `${user.username} 님이 퇴장하셨습니다.`));
//         io.to(user.room).emit('roomData', {
//           room: user.room,
//           users: getUsersInRoom(user.room),
//         });
//       }
//     });
//   });
// };
