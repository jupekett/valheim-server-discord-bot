// Enumerates relevant server output messages that should be handled in the bot script.
// You can enable/disable the listened messages
export const serverOutputs = {
  STARTING_SEQUENCE: {
    SERVER_STARTING: /^Starting server/,
    VALHEIM_VERSION: /Valheim version:(\d+.\d+.\d+)/,
    WORLD_NAME: /Get create world ([\w ]+)\n/,
    SERVER_READY: /Load world/, // Last unique message when opening server
  },
  PLAYER_JOIN_SEQUENCE: {
    PLAYER_JOINED: /Got handshake from client (\d+)/, // ..steamID
    CHARACTER_NAME: /Got character ZDOID from ([\w ]+) :/,
  },
  PLAYER_LEFT_SEQUENCE: {
    PLAYER_LEFT: /Closing socket (\d+)/, // ..steamID. FIXME: server doesn't always output this when player leaves.
  },
  CLOSING_SEQUENCE: {
    SERVER_CLOSING: /ZNet Shutdown/,
  },
};
