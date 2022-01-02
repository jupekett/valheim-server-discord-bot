const DEBUG = process.env.DEBUG === "true"; // log extra stuff in console?

function log(message) {
  if (DEBUG) {
    console.info(message);
  }
}

export { log };
