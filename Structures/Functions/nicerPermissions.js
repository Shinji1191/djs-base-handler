/**
 * Made By: Kev#1880
 * Format permissions: SEND_MESSAGES -> Send Messages etc.
 * @param {string} permissionString 
 * @returns 
 */
module.exports.nicerPermissions = function (permissionString) {
  return permissionString.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}