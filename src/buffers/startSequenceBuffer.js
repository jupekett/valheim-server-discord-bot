import {
  getSequenceKeys,
  getEmptyBufferWithSequenceKeys,
  lastItemOfSequence,
} from "./bufferUtils.js";
import { sendMessage } from "../bot.js";

const START_SEQUENCE_KEYS = getSequenceKeys("STARTING_SEQUENCE");

const START_BUFFER = getEmptyBufferWithSequenceKeys(START_SEQUENCE_KEYS);

function bufferServerStartMessage(channel, message, key) {
  START_BUFFER[key] = message;
  if (key === lastItemOfSequence(START_SEQUENCE_KEYS)) {
    sendServerStartMessage(channel, START_BUFFER);
  }
}

function sendServerStartMessage(channel, buffer) {
  const message = composeServerStartMessage(buffer);
  sendMessage(channel, message);
}

function composeServerStartMessage(buffer) {
  const readyMessage = buffer["SERVER_READY"];
  const versionMessage = buffer["VALHEIM_VERSION"];
  const worldMessage = buffer["WORLD_NAME"];
  const message = `${readyMessage}\n- ${versionMessage}\n- ${worldMessage}`;
  return message;
}

export { bufferServerStartMessage };
