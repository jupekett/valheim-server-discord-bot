import dotenv from "dotenv";

dotenv.config();

// Requires variables in .env file for each user. Example:
// STEAM_ID1=12345678901234567
// STEAM_NAME1=Tordis Testersson
const steamUsers = {};
const userCount = 4;
for (let i = 1; i <= userCount; i++) {
  const id = process.env[`STEAM_ID${i}`];
  const name = process.env[`STEAM_NAME${i}`];
  steamUsers[id] = name;
}

export { steamUsers };
