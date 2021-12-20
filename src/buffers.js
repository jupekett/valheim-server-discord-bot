import { serverOutputs } from "./serverOutputs.js";
import { sendMessage } from "./bot.js";

const START_SEQUENCE_KEYS = [];
for (const key in serverOutputs["STARTING_SEQUENCE"]) {
  START_SEQUENCE_KEYS.push(key);
}

const startSequenceBuffer = {};
for (const key of START_SEQUENCE_KEYS) {
  startSequenceBuffer[key] = "";
}

function bufferServerStartMessage(channel, message, key) {
  if (startSequenceBuffer[key]) {
    console.warn("Duplicate message in server start sequence.");
    // TODO so what?
  }
  startSequenceBuffer[key] = message;
  if (key === lastItemOfSequence(START_SEQUENCE_KEYS)) {
    sendServerStartMessage(channel, startSequenceBuffer);
  }
}

function lastItemOfSequence(sequence) {
  return sequence[sequence.length - 1];
}

function sendServerStartMessage(channel, buffer) {
  const message = composeServerStartMessage(buffer);
  sendMessage(channel, message);
}

function composeServerStartMessage(buffer) {
  const readyMessage = buffer["SERVER_READY"];
  const versionMessage = buffer["VALHEIM_VERSION"];
  const worldMessage = buffer["WORLD_NAME"];
  const message = `${readyMessage}\n${versionMessage}\n${worldMessage}`;
  return message;
}

function bufferPlayerJoinMessage(channel, message, key) {
  console.warn("player join message buffer not implemented");
}

export { bufferServerStartMessage, bufferPlayerJoinMessage };
