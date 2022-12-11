import kaboom from "kaboom";

import { socket, initializeSocket } from "./socket.js";
import initializeChat from "./chat.js";
import {
  getPlayersObjects,
  getPlayerObject,
  addPlayerObject,
  deletePlayerObject,
  getPlayers,
  getPlayer,
  addPlayer,
  deletePlayer,
  getLocalPlayer,
  setLocalPlayer,
} from "./playersState.js";

initializeSocket();
kaboom();

loadSprite("bean", "sprites/bean.png");

registerMovementListeners();
initializeChat(); // Chat logic + rendering + networking

socket.on("players", (remotePlayers) => {
  remotePlayers.forEach((player) => {
    addPlayer(player);

    if (player.playerID === socket.id) {
      // Add player game object
      const localPlayer = add([
        sprite("bean"),
        // center() returns the center point vec2(width() / 2, height() / 2)
        pos(center()),
      ]);
      if (getLocalPlayer()) {
        destroy(getLocalPlayer());
      }
      setLocalPlayer(localPlayer);
    } else {
      addPlayerObject(player);
    }
  });
});

socket.on("playerConnected", (remotePlayer) => {
  addPlayer(remotePlayer);
  addPlayerObject(remotePlayer);
  console.log("new player connected", remotePlayer);
});

socket.on("playerMoved", ({ playerID, pos }) => {
  console.log(pos);
  getPlayer(playerID).pos = pos;
  getPlayerObject(playerID).moveTo(pos.x, pos.y);
});

socket.on("playerDisconnected", (playerID) => {
  console.log("player disconnected", playerID);
  deletePlayer(playerID);
  deletePlayerObject(playerID);
});

function registerMovementListeners() {
  // Define player movement speed (pixels per second)
  const SPEED = 320;

  onKeyDown("left", () => {
    getLocalPlayer().move(-SPEED, 0);
    localPlayerMoved();
  });

  onKeyDown("right", () => {
    getLocalPlayer().move(SPEED, 0);
    localPlayerMoved();
  });

  onKeyDown("up", () => {
    getLocalPlayer().move(0, -SPEED);
    localPlayerMoved();
  });

  onKeyDown("down", () => {
    getLocalPlayer().move(0, SPEED);
    localPlayerMoved();
  });
}

function localPlayerMoved() {
  socket.emit("playerMoved", {
    pos: getLocalPlayer().pos,
  });
}

onClick(() => addKaboom(mousePos()));
