const path = require('path');

/**
 * @param {string} path 
 * @returns {boolean}
 */
function isPathRelative (path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

/**
 * @param {string} path 
 * @returns {string}
 */
function getNormalPath (filePath) {
  return path.toNamespacedPath(filePath).replace(/[\\]+/g, '/')
}

module.exports = {
  isPathRelative,
  getNormalPath
}