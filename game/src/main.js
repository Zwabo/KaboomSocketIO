import kaboom from "kaboom";
import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });
socket.connect();

kaboom();

loadSprite("bean", "sprites/bean.png");

let players = [];
let playersObjects = [];
let localPlayer = null;

socket.on("players", (remotePlayers) => {
  remotePlayers.forEach((player) => {
    players[player.playerID] = player;

    if (player.playerID === socket.id) {
      // Add player game object
      localPlayer = add([
        sprite("bean"),
        // center() returns the center point vec2(width() / 2, height() / 2)
        pos(center()),
      ]);
    } else {
      playersObjects[player.playerID] = add([sprite("bean"), pos(center())]);
    }
  });
});

socket.on("playerConnected", (remotePlayer) => {
  players[remotePlayer.playerID] = remotePlayer;
  playersObjects[remotePlayer.playerID] = add([sprite("bean"), pos(center())]);
  console.log("new player connected", remotePlayer);
});

socket.on("playerMoved", ({ playerID, pos }) => {
  console.log(pos);
  players[playerID].pos = pos;
  playersObjects[playerID].moveTo(pos.x, pos.y);
});

socket.on("playerDisconnected", (playerID) => {
  console.log("player disconnected", playerID);
  delete players[playerID];
  destroy(playersObjects[playerID]);
});

function registerMovementListeners() {
  // Define player movement speed (pixels per second)
  const SPEED = 320;

  onKeyDown("left", () => {
    localPlayer.move(-SPEED, 0);
    localPlayerMoved();
  });

  onKeyDown("right", () => {
    localPlayer.move(SPEED, 0);
    localPlayerMoved();
  });

  onKeyDown("up", () => {
    localPlayer.move(0, -SPEED);
    localPlayerMoved();
  });

  onKeyDown("down", () => {
    localPlayer.move(0, SPEED);
    localPlayerMoved();
  });
}

function localPlayerMoved() {
  socket.emit("playerMoved", {
    pos: localPlayer.pos,
  });
}

registerMovementListeners();

onClick(() => addKaboom(mousePos()));
