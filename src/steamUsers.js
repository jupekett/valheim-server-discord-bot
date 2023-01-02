import dotenv from "dotenv";

dotenv.config();

const MOCK_USERS = process.env.RUN_SERVER !== "true";

function countUsers(prefix) {
  let count = 0;
  let i = 1;

  // Assumes that user definitions start from ID 1 and are continuous
  while (process.env[`${prefix}_ID${i}`]) {
    count++;
    i++;
  }
  return count;
}

// Requires variables in .env file for each user. Example:
// STEAM_ID1=12345678901234567
// STEAM_NAME1=Tordis Testersson
function getSteamUsers() {
  let prefix = MOCK_USERS ? "MOCK" : "STEAM";

  const steamUsers = {};
  const userCount = countUsers(prefix);

  for (let i = 1; i <= userCount; i++) {
    const id = process.env[`${prefix}_ID${i}`];
    const name = process.env[`${prefix}_NAME${i}`];
    steamUsers[id] = name;
  }
  return steamUsers;
}

export { getSteamUsers };
