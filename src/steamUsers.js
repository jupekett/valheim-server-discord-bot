import dotenv from "dotenv";

dotenv.config();

const MOCK_USERS = process.env.RUN_SERVER !== "true";

function countVariablesWithName(name) {
  // Assumes that user definitions start from ID 1 and don't have gaps
  let variableCount = 0;
  let i = 1;
  while (process.env[`${name}${i}`]) {
    variableCount++;
    i++;
  }
  return variableCount;
}

// Requires variables in .env file for each user. Example:
// STEAM_ID1=12345678901234567
// STEAM_NAME1=Tordis Testersson
function getSteamUsers() {
  if (MOCK_USERS) {
    return getMockUsers();
  }
  const steamUsers = {};
  const userCount = countVariablesWithName("STEAM_ID");
  for (let i = 1; i <= userCount; i++) {
    const id = process.env[`STEAM_ID${i}`];
    const name = process.env[`STEAM_NAME${i}`];
    steamUsers[id] = name;
  }
  return steamUsers;
}

function getMockUsers() {
  const mockUsers = {};
  const userCount = countVariablesWithName("MOCK_ID");
  for (let i = 1; i <= userCount; i++) {
    const id = process.env[`MOCK_ID${i}`];
    const name = process.env[`MOCK_NAME${i}`];
    mockUsers[id] = name;
  }
  return mockUsers;
}

export { getSteamUsers };
