const os = require("os");

function getCurrentHost(req) {
  return req.get("Host");
}

module.exports = { getCurrentHost };
