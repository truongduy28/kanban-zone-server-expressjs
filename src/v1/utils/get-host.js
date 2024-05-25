const os = require("os");

function getCurrentHost() {
  return os.hostname();
}

module.exports = { getCurrentHost };
