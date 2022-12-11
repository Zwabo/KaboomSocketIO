const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8000",
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  // fetch existing players
  const players = [];
  for (let [id, socket] of io.of("/").sockets) {
    players.push({
      playerID: id,
      pos: { x: 0, y: 0 },
    });
  }
  socket.emit("players", players);

  // notify existing players
  socket.broadcast.emit("playerConnected", {
    playerID: socket.id,
    pos: { x: 0, y: 0 },
  });

  // forward the private message to the right recipient
  socket.on("playerMoved", ({ pos }) => {
    socket.broadcast.emit("playerMoved", {
      playerID: socket.id,
      pos,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
