var o = require("object-path");
var n = require("./node.js");

/**
 * @typedef {object} ASTNode
 */

/**
 * Check if provided string is an Ember-name
 *
 * @param {string} str
 * @returns {boolean} true - if provided string is "Em" or "Ember", false - otherwise
 */
function isEmber(str) {
  return str === "Em" || str === "Ember";
}

/**
 * Callback for <code>[].filter</code> to get a new array with unique items only
 *
 * @param {*} value
 * @param {number} index
 * @param {array} self
 * @returns {boolean}
 * @private
 */
function _onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Check if node is an observer
 *
 * @param {ASTNode} node
 * @returns {boolean} true - it is, false - otherwise
 */
function isObserver(node) {
  return _isEmberFieldByType(node, "observes", "observes");
}

/**
 * Check if node is a computed property
 *
 * @param {ASTNode} node
 * @returns {boolean} true - it is, false - otherwise
 */
function isComputedProperty(node) {
  return _isEmberFieldByType(node, "computed", "property");
}

/**
 * Check if node is a computed macro like `Ember.computed.and` etc
 *
 * @param {ASTNode} node
 * @return {boolean} true - it is, false - otherwise
 */
function isComputedMacro(node) {
  var type = o.get(node, "type");
  if (type !== "CallExpression") {
    return false;
  }
  var calleeType = o.get(node, "callee.type");
  if (calleeType === "MemberExpression") {
    if (o.get(node, "callee.object.name") === "computed") {
      return true;
    }
    if (o.get(node, "callee.object.type") === "MemberExpression") {
      var coon = o.get(node, "callee.object.object.name");
      var copn = o.get(node, "callee.object.property.name") || o.get(node, "callee.object.property.value");
      if (isEmber(coon) && copn === "computed") {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get computed macro name
 * This function should be used for nodes that passed <code>isComputedMacro</code>
 *
 * @param {ASTNode} node
 * @returns {?string}
 */
function getComputedMacroName(node) {
  var type = o.get(node, "type");
  if (type !== "CallExpression") {
    return null;
  }
  var calleeType = o.get(node, "callee.type");
  var name = o.get(node, "callee.property.name") || o.get(node, "callee.property.value");
  if (calleeType === "MemberExpression") {
    if (o.get(node, "callee.object.name") === "computed") {
      return name;
    }
    if (o.get(node, "callee.object.type") === "MemberExpression") {
      var coon = o.get(node, "callee.object.object.name");
      var copn = o.get(node, "callee.object.property.name") || o.get(node, "callee.object.property.value");
      if (isEmber(coon) && copn === "computed") {
        return name;
      }
    }
  }
  return null;
}

/**
 * Check if node is a computed property, a computed macro or an observer
 *
 * @param {ASTNode} node
 * @returns {boolean} true - it is, false - otherwise
 */
function isEmberField(node) {
  return isComputedProperty(node) || isComputedMacro(node) || isObserver(node);
}

/**
 * Get list of dependent keys for computed property or observer
 * Should be called after check with <code>isEmberField</code>
 *
 * @param {ASTNode} node
 * @param {boolean} [doUnique] default false
 * @returns {string[]|null} list of dependent keys or <code>null</code> if node doesn't not have <code>arguments</code>
 * @private
 */
function getDependentKeys(node, doUnique) {
  var _doUnique = !!doUnique;
  var keys = o.has(node, "arguments") ? o.get(node, "arguments").map(function (arg) {
    return o.get(arg, "value");
  }).filter(function (value) {
    return "string" === typeof value;
  }) : null;
  return keys && _doUnique ? keys.filter(_onlyUnique) : keys;
}

/**
 * Expand strings like 'a.{b,c}' to ['a.b', 'a.c']
 * Code originally taken from https://github.com/emberjs/ember.js/blob/v2.3.0/packages/ember-metal/lib/expand_properties.js
 *
 * @param {string[]} keys
 * @param {boolean} [doUnique] default false
 * @returns {Array}
 */
function expandDependentKeys(keys, doUnique) {
  var _doUnique = !!doUnique;
  var ret = [];
  var _keys = Array.isArray(keys) ? keys : [keys];
  _keys.forEach(function (key) {
    var parts = key.split(/\{|\}/);
    var properties = [parts];

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part.indexOf(",") !== -1) {
        properties = _duplicateAndReplace(properties, part.split(","), i);
      }
    }
    for (i = 0; i < properties.length; i++) {
      ret.push(properties[i].join(""));
    }
  });
  return ret && _doUnique ? ret.filter(_onlyUnique) : ret;
}

function _duplicateAndReplace(properties, currentParts, index) {
  var all = [];
  properties.forEach(function (property) {
    currentParts.forEach(function (part) {
      var current = property.slice(0);
      current[index] = part;
      all.push(current);
    });
  });
  return all;
}

/**
 * Check if node is ember-field (like computed property or observer)
 * Supports both syntax (see EXTENDED_PROTOTYPES options in the ember-docs)
 *
 * @param {ASTNode} node
 * @param {string} defaultName name like "Ember.computed" (`computed`)
 * @param {string} extendedName name like "function() {}.property" (`property`)
 * @returns {boolean}
 * @private
 */
function _isEmberFieldByType(node, defaultName, extendedName) {
  if (o.get(node, "type") !== "CallExpression") {
    return false;
  }
  return _isEmberFieldsWithoutExtProto(node, defaultName) || _isEmberFieldsWithExtProto(node, extendedName);
}

function _isEmberFieldsWithoutExtProto(node, name) {
  if (o.get(node, "type") !== "CallExpression") {
    return false;
  }
  if (o.get(node, "callee.name") === name) {
    return true;
  }
  var calleeType = o.get(node, "callee.type");
  if (calleeType === "MemberExpression") {
    if (isEmber(o.get(node, "callee.object.name")) && (o.get(node, "callee.property.name") === name || o.get(node, "callee.property.value") === name)) {
      return true;
    }
  }
}

function _isEmberFieldsWithExtProto(node, name) {
  if (o.get(node, "type") !== "CallExpression") {
    return false;
  }
  var calleeType = o.get(node, "callee.type");
  if (calleeType === "MemberExpression") {
    if (o.get(node, "callee.object.type") === "FunctionExpression" && (o.get(node, "callee.property.name") === name || o.get(node, "callee.property.value") === name)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if provided node is a <code>function () {}.property()</code>
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isCpWithExtProto(node) {
  return _isEmberFieldsWithExtProto(node, "property");
}

/**
 * Checks if provided node is a <code>function () {}.observes()</code>
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isObserverWithExtProto(node) {
  return _isEmberFieldsWithExtProto(node, "observes");
}

/**
 * Try to detect computed property's body like part of
 * <pre>
 *    computed('a', 'b', {
 *      get () { ... }
 *    });
 * </pre>
 *
 * @param {ASTNode} node
 * @param {string} method "get|set"
 * @returns {boolean}
 * @private
 */
function _isCpAccessor1(node, method) {
  var type = o.get(node, "type");
  if (type !== "FunctionExpression") {
    return false;
  }
  if (o.get(node, "parent.key.name") !== method) {
    return false;
  }
  var pParent = o.get(node, "parent.parent");
  if (!pParent) {
    return false;
  }
  if (o.get(pParent, "type") !== "ObjectExpression") {
    return false;
  }
  var ppParent = o.get(pParent, "parent"); // more parents!
  if (o.get(ppParent, "type") !== "CallExpression") {
    return false;
  }
  var callee = o.get(ppParent, "callee");
  if (o.get(callee, "type") === "Identifier" && o.get(callee, "name") === "computed") {
    return true;
  }
  if (o.get(callee, "type") === "MemberExpression") {
    var caller = n.getCaller(callee);
    return ["Ember.computed", "Em.computed"].indexOf(caller) !== -1;
  }
  return false; // don't know how you could get here
}

/**
 * Try to detect computed property's body like part of
 * <pre>
 *    computed('a', 'b', function () {
 *      // ...
 *    });
 * </pre>
 *
 * @param {ASTNode} node
 * @returns {boolean}
 * @private
 */
function _isCpGetter2(node) {
  var type = o.get(node, "type");
  if (type !== "FunctionExpression") {
    return false;
  }
  var parent = o.get(node, "parent");
  if (o.get(parent, "type") !== "CallExpression") {
    return false;
  }
  var callee = o.get(parent, "callee");
  if (o.get(callee, "type") === "Identifier" && o.get(callee, "name") === "computed") {
    return true;
  }
  if (o.get(callee, "type") === "MemberExpression") {
    var caller = n.getCaller(callee);
    return ["Ember.computed", "Em.computed"].indexOf(caller) !== -1;
  }
  return false;
}

/**
 * Try to detect computed property's body like part of
 * <pre>
 *    function () {
 *      // ...
 *    }.property('a', 'b')
 * </pre>
 *
 * @param {ASTNode} node
 * @returns {boolean}
 * @private
 */
function _isCpGetter3(node) {
  var type = o.get(node, "type");
  if (type !== "FunctionExpression") {
    return false;
  }
  return o.get(node, "parent.property.name") === "property";
}

/**
 * Check if node is getter for computed property
 *
 * @param {ASTNode} node
 * @returns {boolean} true - it is, false - otherwise
 */
function isCpGetter(node) {
  return _isCpAccessor1(node, "get") || _isCpGetter2(node) || _isCpGetter3(node);
}

/**
 * Check if node is setter for computed property
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isCpSetter(node) {
  return _isCpAccessor1(node, "set");
}

module.exports = {
  getDependentKeys: getDependentKeys,
  isObserver: isObserver,
  isComputedProperty: isComputedProperty,
  isComputedMacro: isComputedMacro,
  isEmberField: isEmberField,
  expandDependentKeys: expandDependentKeys,
  isCpGetter: isCpGetter,
  isCpSetter: isCpSetter,
  getComputedMacroName: getComputedMacroName,
  isEmber: isEmber,
  isCpWithExtProto: isCpWithExtProto,
  isObserverWithExtProto: isObserverWithExtProto
};