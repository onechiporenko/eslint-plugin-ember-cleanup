var obj = require("object-path");

function getCaller (node) {
  var o, p;
  if (obj.get(node, "type") === "MemberExpression") {
    o = obj.get(node, "object.type") === "ThisExpression" ? "this" :
      (obj.get(node, "object.type") === "MemberExpression" ? getCaller(node.object) : obj.get(node, "object.name"));
    p = obj.get(node, "property.name") || obj.get(node, "property.value");
    return p ? o + "." + p : o;
  }
  var callee = obj.get(node, "callee");
  if (!callee) {
    return "";
  }
  if (obj.get(callee, "type") === "MemberExpression") {
    o = obj.get(callee, "object.type") === "ThisExpression" ? "this" :
      (obj.get(callee, "object.type") === "MemberExpression" ? getCaller(callee.object) : obj.get(callee, "object.name"));
    p = obj.get(callee, "property.name") || obj.get(callee, "property.value");
    return p ? o + "." + p : o;
  }
  return obj.get(callee, "name");
}

function _endsWith (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function cleanCaller (caller) {
  if (!caller) {
    return "";
  }
  [".call", ".apply"].forEach(function (e) {
    if (_endsWith(caller, e)) {
      var i = caller.lastIndexOf(e);
      caller = caller.substr(0, i);
    }
  });
  return caller;
}

/**
 * Get list of all properties in the Object Expression node
 * Object - is a "grand parent" for the provided node
 * Result doesn't contain name of the `node` property
 *
 * @param {ASTNode} node
 * @returns {string[]}
 */
function getPropertyNamesInParentObjectExpression(node) {
  var objectExpression = obj.get(node, "parent.parent");
  var ret = [];
  if (!objectExpression) {
    return ret;
  }
  objectExpression.properties.forEach(function (p) {
    if (p.value !== node) {
      ret.push(p.key.name);
    }
  });
  return ret;
}

/**
 * Checks if node is property value declaration in the object expression
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isPropertyValueDeclaration (node) {
  return obj.get(node, "parent.type") === "Property" && obj.get(node, "parent.parent.type") === "ObjectExpression";
}

/**
 *
 *
 * @param {ASTNode} node
 * @returns {?string}
 */
function getFunctionName (node) {
  if (node.type !== "CallExpression") {
    return null;
  }
  return obj.get(node, "callee.type") === "Identifier" ? obj.get(node, "callee.name") : (obj.get(node, "callee.property.name") || obj.get(node, "callee.property.value"));
}

module.exports = {
  getCaller: getCaller,
  cleanCaller: cleanCaller,
  isPropertyValueDeclaration: isPropertyValueDeclaration,
  getPropertyNamesInParentObjectExpression: getPropertyNamesInParentObjectExpression,
  getFunctionName: getFunctionName
};