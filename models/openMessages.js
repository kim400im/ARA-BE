const generateMessage = (username, text) => ({
    username,
    text,
    createdAt: new Date().toISOString(),
  });
  
  module.exports = { generateMessage };
  