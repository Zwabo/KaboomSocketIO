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
import { loadSprites } from "./levelUtils.js";

initializeSocket();
kaboom({
  scale: 4,
  clearColor: [0, 0, 0],
});
loadSprites(); // Load and process tileset
registerMovementListeners();
initializeChat(); // Chat logic + rendering + networking

socket.on("players", (remotePlayers) => {
  remotePlayers.forEach((player) => {
    addPlayer(player);

    if (player.playerID === socket.id) {
      // Add player game object
      const localPlayer = add([
        sprite("hero", { anim: "idle" }),
        pos(center()),
        area({ width: 12, height: 12, offset: vec2(0, 6) }),
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
  const SPEED = 120;

  onKeyDown("left", () => {
    getLocalPlayer().move(-SPEED, 0);
    getLocalPlayer().flipX(true);
    localPlayerMoved();
  });

  onKeyDown("right", () => {
    getLocalPlayer().move(SPEED, 0);
    getLocalPlayer().flipX(false);
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

  onKeyPress(["left", "right", "up", "down"], () => {
    getLocalPlayer().play("run");
  });

  onKeyRelease(["left", "right", "up", "down"], () => {
    if (
      !isKeyDown("left") &&
      !isKeyDown("right") &&
      !isKeyDown("up") &&
      !isKeyDown("down")
    ) {
      getLocalPlayer().play("idle");
    }
  });
}

function localPlayerMoved() {
  socket.emit("playerMoved", {
    pos: getLocalPlayer().pos,
  });
}
