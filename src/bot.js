import { Client, Intents } from "discord.js";
import { log } from "./utils.js";
import { spawn } from "child_process";
import { serverOutputs } from "./serverOutputs.js";
import { discordMessages } from "./discordMessages.js";
import { getSteamUsers } from "./steamUsers.js";
import { bufferServerStartMessage } from "./buffers/startSequenceBuffer.js";
import { bufferPlayerJoinMessage } from "./buffers/joinSequenceBuffer.js";
import dotenv from "dotenv";

dotenv.config();

const DEBUG = process.env.DEBUG === "true"; // log extra stuff in console?
const DRY_RUN = process.env.DRY_RUN === "true"; // suppress sending messages to Discord?
const RUN_SERVER = process.env.RUN_SERVER === "true"; // run the actual Valheim server?
log("Startup parameters:");
log("DEBUG: " + DEBUG);
log("DRY_RUN: " + DRY_RUN);
log("RUN_SERVER: " + RUN_SERVER);

const STEAM_USERS = getSteamUsers();
log("Steam users:");
log(STEAM_USERS);

function getClient() {
  log("Function call: getClient");
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  client.once("ready", async () => {
    startServer(client);
  });
  return client;
}

async function getChannel(client) {
  log("Function call: getChannel");
  if (!client || !client.isReady()) {
    const message = "getChannel: client is not ready yet";
    console.error(message);
    throw new Error(message);
  }
  const channelID = process.env.CHANNEL_ID;
  const channel = await client.channels.cache.get(channelID);
  return channel;
}

function sendMessage(channel, message) {
  log("Function call: sendMessage");
  if (!channel) {
    const message = "sendMessage: channel is undefined";
    console.error(message);
    throw new Error(message);
  }
  console.info(`Sending a message: ${message}`);
  if (DRY_RUN) return;
  channel.send(message);
}

async function startServer(client) {
  log("Function call: startServer");
  const script = RUN_SERVER ? startServerScript() : startTestScript();
  log(`Script started: ${script.path}`);

  const channel = await getChannel(client);

  script.stdout.on("data", (data) => {
    handleServerOutput(channel, data);
  });

  script.on("close", async (code) => {
    log(`Script exited with code ${code}`);
    shutdown();
  });

  process.on("SIGINT", () => {
    log("Bot received SIGINT");
    script.kill("SIGINT");
  });
}

function startServerScript() {
  const path = process.env.SERVER_SCRIPT_PATH;
  const workingDirectory = getPathDirectory(path);
  return spawn(path, [], { cwd: workingDirectory });
}

function getPathDirectory(path) {
  const index = path.lastIndexOf("/");
  if (index === -1) {
    console.warn("getPathDirectory: path doesn't include slashes");
  }
  const dir = path.substring(0, index);
  return dir;
}

function startTestScript() {
  const path = "./scripts/output-test.sh";
  return spawn(path);
}

function shutdown() {
  setTimeout(() => {
    log("Bot process exiting");
    process.exit();
  }, 1000); // give time for closing message to be sent
}

function handleServerOutput(channel, data) {
  log("Function call: handleServerOutput");
  const output = parseServerOutput(data);
  console.info(`Server output: ${output}\n`);

  for (const sequence in serverOutputs) {
    log(`Iterated output sequence: ${sequence}`);
    for (const key in serverOutputs[sequence]) {
      log(`Iterated output key: ${key}`);
      const regex = serverOutputs[sequence][key];
      const match = output.match(regex);
      if (!match) {
        continue;
      }
      log(`Match found for key: ${key}`);
      const message = createDiscordMessage(match, key);
      if (sequence === "STARTING_SEQUENCE") {
        bufferServerStartMessage(channel, message, key);
      } else if (sequence === "PLAYER_JOIN_SEQUENCE") {
        bufferPlayerJoinMessage(channel, message, key);
      } else {
        sendMessage(channel, message);
      }
      return;
    }
  }
  log("No operation for this output.");
}

function createDiscordMessage(match, key) {
  const message = discordMessages[key];
  if (!message) {
    console.warn(`createDiscordMessage: message with key ${key} not found.`);
  }
  const fullMessage = appendCapturedData(message, match, key);
  return fullMessage;
}

function appendCapturedData(message, match, key) {
  if (!match[1]) {
    return message;
  }
  const data = match[1];
  const appendage = key.startsWith("PLAYER") ? getSteamUserName(data) : data;
  return message + appendage;
}

function getSteamUserName(id) {
  const name = STEAM_USERS[id];
  if (!name) {
    console.warn("getSteamUserName: username not found with ID", id);
  }
  return name;
}

// Server output includes useless filename and linenumber debug data.
function parseServerOutput(data) {
  log("Function call: parseServerOutput");
  const text = data.toString();
  const splitRegex = /\(Filename:/;
  const match = text.match(splitRegex);
  const relevantText = match ? text.substring(0, match.index) : text;
  const strippedText = relevantText.trim(); // strip unnecessary line breaks
  return strippedText;
}

/** Entry point */
async function runBotAndServer() {
  const token = process.env.TOKEN;
  const client = getClient();
  await client.login(token);
}

export { runBotAndServer, sendMessage };
