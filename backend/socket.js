let io;

function initSocket(server) {
  const { Server } = require("socket.io");

  if (io) return io;

  io = new Server(server, { 
    cors: { 
      origin: "*", 
      methods: ["GET", "POST"] 
    } 
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    
    socket.on("joinGame", (gameId) => {
      socket.join(`game_${gameId}`);
      console.log(`User ${socket.id} joined room game_${gameId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIO };