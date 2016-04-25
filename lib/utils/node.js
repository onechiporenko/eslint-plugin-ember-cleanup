var obj = require("object-path");

function getCaller (node) {
  var o, p;
  if (node.type === "MemberExpression") {
    o = node.object.type === "ThisExpression" ? "this" :
      (node.object.type === "MemberExpression" ? getCaller(node.object) : node.object.name);
    p = node.property.name || node.property.value;
    return p ? o + "." + p : o;
  }
  var callee = node.callee;
  if (!callee) {
    return "";
  }
  if (callee.type === "MemberExpression") {
    o = callee.object.type === "ThisExpression" ? "this" :
      (callee.object.type === "MemberExpression" ? getCaller(callee.object) : callee.object.name);
    p = callee.property.name || callee.property.value;
    return p ? o + "." + p : o;
  }
  return callee.name;
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
 * Get function/method name from Call Expression
 * Examples:
 * "a()" - "a"
 * "a.b()" - "b"
 * "a.b.c()" - "c"
 *
 * @param {ASTNode} node
 * @returns {?string}
 */
function getFunctionName (node) {
  if (node.type !== "CallExpression") {
    return null;
  }
  var callee = node.callee;
  return callee && callee.type === "Identifier" ?
    callee.name :
    (callee.property.name || callee.property.value);
}

module.exports = {
  getCaller: getCaller,
  cleanCaller: cleanCaller,
  isPropertyValueDeclaration: isPropertyValueDeclaration,
  getPropertyNamesInParentObjectExpression: getPropertyNamesInParentObjectExpression,
  getFunctionName: getFunctionName
};