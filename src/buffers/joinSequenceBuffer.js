import {
  getSequenceKeys,
  getEmptyBufferWithSequenceKeys,
} from "./bufferUtils.js";
import { sendMessage } from "../bot.js";

const JOIN_SEQUENCE_KEYS = getSequenceKeys("PLAYER_JOIN_SEQUENCE");

const joinBuffers = [];
pushNewJoinBuffer();

function pushNewJoinBuffer() {
  const joinSequenceBuffer = getEmptyJoinBuffer();
  joinBuffers.push(joinSequenceBuffer);
}

function getEmptyJoinBuffer() {
  return getEmptyBufferWithSequenceKeys(JOIN_SEQUENCE_KEYS);
}

function bufferPlayerJoinMessage(channel, message, key) {
  for (let buffer of joinBuffers) {
    const playerMessage = buffer["PLAYER_JOINED"];
    const characterMessage = buffer["CHARACTER_NAME"];
    if (key === "PLAYER_JOINED" && !playerMessage) {
      buffer["PLAYER_JOINED"] = message;
    } else if (key === "PLAYER_JOINED" && playerMessage) {
      // player join message should be buffered, but there is already a message there.
      pushNewJoinBuffer(); // FIXME ei saa muuttaa iteroitavaa taulukkoa!
      // TODO add the playerMessage to the fresh buffer
    } else if (key === "CHARACTER_NAME" && !characterMessage && playerMessage) {
      // matching player and character messages
      // (with the exception of nested join sequences: join1-join2-character2-character1)
      buffer["CHARACTER_NAME"] = message;
      sendPlayerJoinMessage(channel, buffer);
      buffer = getEmptyJoinBuffer();
      return;
    } else if (key == "CHARACTER_NAME" && characterMessage) {
      // Character name message should be buffered, but there is already a message there.
      // This shouldn't happen often, because buffer is emptied every time a login finishes.
      console.warn(
        "tried to buffer character name message, but buffer wasn't empty there"
      );
      console.warn(
        "player join buffer wasn't properly emptied, or nested login message sequences happened"
      );
    }
  }
}

function getLatestJoinBuffer() {
  return joinBuffers[joinBuffers.length - 1];
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
