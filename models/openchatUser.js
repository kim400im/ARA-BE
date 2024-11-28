const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim();
  room = room.trim();

  if (!username || !room) {
    return { error: '사용자 이름과 방 이름이 필요합니다.' };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room.trim());
const getUser = (id) => users.find((user) => user.id === id);
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return index !== -1 ? users.splice(index, 1)[0] : null;
};

module.exports = { addUser, getUsersInRoom, getUser, removeUser };
