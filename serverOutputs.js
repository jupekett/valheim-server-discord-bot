// Enumerates relevant server output messages that should be handled in the bot script.
// TODO: muuta stringiksi? Helpompi vertailla yms.
export const serverOutputs = {
  SERVER_STARTING: /^Starting server/,
  VALHEIM_VERSION: /Valheim version:(\d+.\d+.\d+)/,
  WORLD_NAME: /Get create world ([\w ]+)\n/, 
  SERVER_READY: /Load world/, // Last unique message when opening server
  PLAYER_JOINED: /Got handshake from client (\d+)/, // ..steamID
  CHARACTER_NAME: /Got character ZDOID from ([\w ]+) :/, 
  PLAYER_LEFT: /Closing socket (\d+)/, // ..steamID
  SERVER_CLOSING: /ZNet Shutdown/,
};
