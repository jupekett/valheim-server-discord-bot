"use strict";

import { Client, Intents } from "discord.js";
import { spawn } from "child_process";
import { serverOutputs } from "./serverOutputs.js";
import { discordMessages } from "./discordMessages.js";
import dotenv from "dotenv";

const DEBUG = false; // log extra stuff in console?
const DRY_RUN = true; // don't send messages to Discord?
const RUN_SERVER = false; // run the actual Valheim server?

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
  // sendStartMessage(client);

  const channel = await getChannel(client);

  script.stdout.on("data", (data) => {
    handleServerOutput(channel, data);
  });

  script.on("close", async (code) => {
    log(`Script has exited with code ${code}`);
    setTimeout(() => {
      log("Exiting the bot process");
      process.exit();
    }, 1000); // give time for closing message to be sent
  });

  process.on("SIGINT", () => {
    log("Bot received SIGINT");
    script.kill("SIGINT");
  });
}

function handleServerOutput(channel, data) {
  log("Function call: handleServerOutput");
  const output = parseServerOutput(data);

  console.info(`Server output: ${output}`);

  for (let key in serverOutputs) {
    const regex = serverOutputs[key];
    if (output.match(regex)) {
      console.log(`Mätsännyt key: ${key}`);
      //TODO olisiko hyvä yhdistää serverin käynnistykseen liittyvät viestit yhdeksi discord-viestiksi?
      // Ei tulisi niin paljon spämmiä serveriä käynnistäessä.
      sendMessageWithKey(channel, key);
      return;
    }
  }
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

function sendMessageWithKey(channel, key) {
  const message = discordMessages[key];
  if (!message) {
    console.warn("Discord message was not found with key", key);
    return;
  }
  // FIXME vaatii yksilöllisempää käsittelyä jos halutaan välittää muuttujia
  sendMessage(channel, message);
}

/** Entry point */
async function main() {
  initialize();

  // console.log("message regexes");
  // console.log(serverOutputs);
  const token = process.env.TOKEN;
  const client = getClient();
  await client.login(token);
}

main();
