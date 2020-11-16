const fs = require('fs');
const { promisify } = require('util');
const appendFile = promisify(fs.appendFile);
async function errorLogger(req, res, next, err) {
  try {
    const logMessage = `${err}`;
    await appendFile('errorLogger.log', logMessage);
    next();
  } catch (err) {
    next(err);
  }
}
module.exports = errorLogger;
