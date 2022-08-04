// Enumerates relevant server output messages that should be handled in the bot script.
// You can enable/disable the listened messages
export const serverOutputs = {
  STARTING_SEQUENCE: {
    SERVER_STARTING: /^Starting server/,
    WORLD_NAME: /Get create world ([a-zA-Z0-9]+)/,
    VALHEIM_VERSION: /Valheim version:(\d+.\d+.\d+)/,
    SERVER_READY: /Load world/, // Last unique message when opening server
  },
  PLAYER_JOIN_SEQUENCE: {
    PLAYER_JOINED: /Got handshake from client (\d+)/, // ..steamID
    CHARACTER_NAME: /Got character ZDOID from ([a-zA-ZåäöæøÅÄÖÆØ' ]+) :/,
  },
  PLAYER_LEFT_SEQUENCE: {
    PLAYER_LEFT: /Closing socket (\d+)/, // ..steamID. FIXME: server doesn't always output this when player leaves.
  },
  CLOSING_SEQUENCE: {
    SERVER_CLOSING: /ZNet Shutdown/,
  },
};
