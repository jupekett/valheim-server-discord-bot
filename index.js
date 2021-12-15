"use strict";

import { Client, Intents } from "discord.js";
import { spawn } from "child_process";
import { serverOutputs } from "./serverOutputs.js";
import { discordMessages } from "./discordMessages.js";
import { steamUsers } from "./steamUsers.js";
import dotenv from "dotenv";

const DEBUG = false; // log extra stuff in console?
const DRY_RUN = false; // suppress sending messages to Discord?
const RUN_SERVER = true; // run the actual Valheim server?

function log(message) {
  if (DEBUG) {
    console.info(message);
  }
}

function initialize() {
  log("Function call: initialize");
  dotenv.config();
}

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
  const path = RUN_SERVER
    ? process.env.SCRIPT_PATH
    : process.env.SCRIPT_PATH_TEST;
  const script = spawn(path);
  log(`Script started: ${path}`);

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

function shutdown() {
  setTimeout(() => {
    log("Bot process exiting");
    process.exit();
  }, 1000); // give time for closing message to be sent
}

function handleServerOutput(channel, data) {
  log("Function call: handleServerOutput");
  const output = parseServerOutput(data);
  console.info(`Server output: ${output}`);

  for (let key in serverOutputs) {
    const regex = serverOutputs[key];
    const match = output.match(regex);
    if (match) {
      log(`Match found for key: ${key}`);
      const message = createDiscordMessage(match, key);
      sendMessage(channel, message);
      return;
    }
  }
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
  log("steam users");
  log(steamUsers);
  const name = steamUsers[id];
  if (!name) {
    console.warn("getSteamUserName: username not found with ID", id);
  }
  return name;
}

// Server output includes useless filename and linenumber debug data.
function parseServerOutput(data) {
  log("Function call: parseServerOutput");
  const text = data.toString();
  const splitRegex = /\n\(Filename:/;
  const match = text.match(splitRegex);
  const relevantText = match ? text.substring(0, match.index) : text;
  return relevantText;
}

/** Entry point */
async function main() {
  initialize();

  const token = process.env.TOKEN;
  const client = getClient();
  await client.login(token);
}

main();
