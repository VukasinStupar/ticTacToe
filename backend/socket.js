const { WebSocketServer } = require('ws');
const url = require('url');

let wss;
const connections = new Map();
const rooms = {};
let nextId = 1;

function initSocket(server) {
  if (wss) return wss;
  

  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/ws')) {
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit('connection', ws, req),
      );
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws, req) => {
    const userId =
      new URL(req.url, `http://${req.headers.host}`).searchParams.get(
        'userId',
      ) || `guest_${nextId}`;

    const id = nextId++;
    ws.id = id;
    ws.userId = userId;
    connections.set(id, ws);

    console.log(`User ${userId} connected with ID ${id}`);

    ws.on('message', (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch {
        return;
      }

      if (data.type === 'joinGame' && data.gameId) {
        const roomName = `game_${data.gameId}`;
        if (!rooms[roomName]) rooms[roomName] = new Set();
        rooms[roomName].add(id);
        ws.room = roomName;
        console.log(`User ${id} joined room ${roomName}`);
      }

      if (data.type === 'move' && ws.room) {
        rooms[ws.room].forEach((memberId) => {
          const client = connections.get(memberId);
          if (client.readyState === 1 && client.id !== ws.id) {
            client.send(JSON.stringify(data));
          }
        });
      }
    });

    ws.on('close', () => {
      if (ws.room && rooms[ws.room]) {
        rooms[ws.room].delete(id);
        if (rooms[ws.room].size === 0) delete rooms[ws.room];
      }
      connections.delete(id);
      console.log(`User ${userId} disconnected`);
    });
  });

  return wss;
}

function getWSS() {
  if (!wss) throw new Error('WS server not initialized!');
  return wss;
}

module.exports = { initSocket, getWSS };
