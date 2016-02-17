var obj = require("object-path");

function getCaller (node) {
  var o, p;
  if (obj.get(node, "type") === "MemberExpression") {
    o = obj.get(node, "object.type") === "MemberExpression" ? getCaller(node.object) : obj.get(node, "object.name");
    p = obj.get(node, "property.name") || obj.get(node, "property.value");
    return p ? o + "." + p : o;
  }
  var callee = obj.get(node, "callee");
  if (!callee) {
    return "";
  }
  if (obj.get(callee, "type") === "MemberExpression") {
    o = obj.get(callee, "object.type") === "MemberExpression" ? getCaller(callee.object) : obj.get(callee, "object.name");
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
    return caller;
  }
  [".call", ".apply"].forEach(function (e) {
    if (_endsWith(caller, e)) {
      var i = caller.lastIndexOf(e);
      caller = caller.substr(0, i);
    }
  });
  return caller;
}

module.exports = {
  getCaller: getCaller,
  cleanCaller: cleanCaller
};