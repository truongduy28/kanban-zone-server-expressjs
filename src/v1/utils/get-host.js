const os = require("os");

function getCurrentHost(req) {
  return req.protocol + "://" + req.get("Host") + "/images/avatars";
}

module.exports = { getCurrentHost };
