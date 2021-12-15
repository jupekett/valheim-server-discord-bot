import dotenv from "dotenv";

dotenv.config();

// Requires variables in .env file for each user. Example:
// STEAM_ID1=12345678901234567
// STEAM_NAME1=Tordis Testersson
const steamUsers = {};
const userCount = 4;
for (let i = 1; i <= userCount; i++) {
  steamUsers[process.env[`STEAM_ID${i}`]] = process.env[`STEAM_NAME${i}`];
}

export { steamUsers };
