import { socket } from "./socket.js";
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

let keyString = "";
let chatTextComponent;

function initializeChat() {
  buildChatComponent();
  registerChatListener();
  listenToChatMessages();
}

function registerChatListener() {
  let keydownListener = (keyEvent) => {
    // Check if the "Enter" key was clicked again
    if (keyEvent.key === "Enter") {
      emitChatMessage(keyString);
      keyString = "";
      document.removeEventListener("keydown", keydownListener);
    } else {
      keyString += keyEvent.key;
    }
    rerenderChatComponent(); // Update current typed text
  };

  document.addEventListener("keydown", (event) => {
    // Listen for enter key that indicates that player wants to type a message
    if (event.key === "Enter") {
      document.addEventListener("keydown", keydownListener);
    }
  });
}

function buildChatComponent() {
  chatTextComponent = add([text(keyString, { size: 36 }), pos(24, 24)]);
}

function rerenderChatComponent() {
  chatTextComponent.text = keyString;
}

function emitChatMessage(msg) {
  socket.emit("chatMessage", {
    msg,
  });
}

function listenToChatMessages() {
  socket.on("chatMessage", ({ msg, playerID }) => {
    getPlayerObject(playerID).text = msg;
    setTimeout(() => {
      getPlayerObject(playerID).text = "";
    }, 5000);
  });
}

export default initializeChat;
