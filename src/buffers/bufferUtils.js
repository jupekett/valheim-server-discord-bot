import { serverOutputs } from "../serverOutputs.js";

function getSequenceKeys(sequenceName) {
  const sequenceKeys = [];
  for (const key in serverOutputs[sequenceName]) {
    sequenceKeys.push(key);
  }
  return sequenceKeys;
}

function getEmptyBufferWithSequenceKeys(sequenceKeys) {
  const buffer = {};
  for (const key of sequenceKeys) {
    buffer[key] = "";
  }
  return buffer;
}

function lastItemOfSequence(sequence) {
  return sequence[sequence.length - 1];
}

export { getSequenceKeys, getEmptyBufferWithSequenceKeys, lastItemOfSequence };
