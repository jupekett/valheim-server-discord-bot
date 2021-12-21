import {
  getSequenceKeys,
  getEmptyBufferWithSequenceKeys,
} from "./bufferUtils.js";
import { sendMessage } from "../bot.js";

const JOIN_SEQUENCE_KEYS = getSequenceKeys("PLAYER_JOIN_SEQUENCE");
const JOIN_BUFFERS = [];

function bufferPlayerJoinMessage(channel, message, key) {
  if (key === "PLAYER_JOINED") {
    handlePlayerJoinMessage(message);
    return;
  } else if (key === "CHARACTER_NAME") {
    handleCharacterMessage(channel, message);
  } else {
    console.warn("Wrong key for buffering player join messages: ", key);
  }
}

function handlePlayerJoinMessage(message) {
  pushNewJoinBuffer();
  const buffer = getLatestJoinBuffer();
  buffer["PLAYER_JOINED"] = message;
}

function pushNewJoinBuffer() {
  const joinSequenceBuffer = getEmptyJoinBuffer();
  JOIN_BUFFERS.push(joinSequenceBuffer);
}

function getEmptyJoinBuffer() {
  return getEmptyBufferWithSequenceKeys(JOIN_SEQUENCE_KEYS);
}

function getLatestJoinBuffer() {
  return JOIN_BUFFERS[JOIN_BUFFERS.length - 1];
}

function handleCharacterMessage(channel, message) {
  for (let buffer of JOIN_BUFFERS) {
    const playerMessage = buffer["PLAYER_JOINED"];
    const characterMessage = buffer["CHARACTER_NAME"];
    if (playerMessage && !characterMessage) {
      // assuming sequential complete logins (join1-character1-join2-character2)
      // TODO handle nested login sequences (join1-join2-character2-character1)
      buffer["CHARACTER_NAME"] = message;
      sendPlayerJoinMessage(channel, buffer);
      buffer = getEmptyJoinBuffer();
      return;
    }
  }
}

function sendPlayerJoinMessage(channel, buffer) {
  const message = composePlayerJoinMessage(buffer);
  sendMessage(channel, message);
}

function composePlayerJoinMessage(buffer) {
  const playerMessage = buffer["PLAYER_JOINED"];
  const characterMessage = buffer["CHARACTER_NAME"];
  const message = `${playerMessage}\n${characterMessage}`;
  return message;
}

export { bufferPlayerJoinMessage };
