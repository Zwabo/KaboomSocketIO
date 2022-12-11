let players = []; // Remote player states
let playersObjects = []; // Remote player object components
let localPlayer = null; // Local player state

// Get remote player object components
function getPlayersObjects() {
  return playersObjects;
}

// Get remote player object component by playerID
function getPlayerObject(playerID) {
  return playersObjects[playerID];
}

// Add a remote player object component
function addPlayerObject(remotePlayer) {
  const playerObj = add([
    sprite("hero", { anim: "idle" }),
    pos(center()),
    area({ width: 12, height: 12, offset: vec2(0, 6) }),
    text("", {
      size: 12,
      transform: (i, ch) => ({
        pos: vec2(0, -2),
        scale: wave(1, 1.2, time() * 3 + i),
        angle: wave(-9, 9, time() * 3 + i),
      }),
    }),
  ]);
  playersObjects[remotePlayer.playerID] = playerObj;
}

// Delete a remote player object component
function deletePlayerObject(playerID) {
  destroy(playersObjects[playerID]);
}

// Get remote player states
function getPlayers() {
  return players;
}

// Get remote player state
function getPlayer(playerID) {
  return players[playerID];
}

// Add a remote player
function addPlayer(remotePlayer) {
  players[remotePlayer.playerID] = remotePlayer;
}

// Delete a remote player
function deletePlayer(playerID) {
  delete players[playerID];
}

function getLocalPlayer() {
  return localPlayer;
}

function setLocalPlayer(player) {
  localPlayer = player;
}
export {
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
};
