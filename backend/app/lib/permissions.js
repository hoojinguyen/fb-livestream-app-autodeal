const _ = require("lodash");

const isUser = user => user.id;
const isAdmin = user => user.role == "admin";

const permissions = {
  public: () => true,
  user: isUser,
  admin: isAdmin
};

async function hasPermission(user, permission, args) {
  user = user || {};
  if (user.role == "admin") {
    return true;
  }
  let checks = permission;
  if (typeof permission == "string") {
    checks = permissions[permission];
    if (!checks) {
      throw new Error(`Invalid permission '${permission}'`);
    }
  }
  if (!checks) {
    return false;
  }
  if (!Array.isArray(checks)) {
    checks = [checks];
  }
  let checkEach = checks.map(f => f(user, args));
  return _.every(await Promise.all(checkEach));
}

module.exports = {
  hasPermission,
  permissions
};
