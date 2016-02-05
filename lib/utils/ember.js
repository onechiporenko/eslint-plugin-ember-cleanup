var o = require('object-path');

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
 * Check if node is a computed property or observer
 *
 * @param {ASTNode} node
 * @returns {boolean} true - it is, false - otherwise
 */
function isEmberField(node) {
  return isComputedProperty(node) || isObserver(node);
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
  var type = o.get(node, "type");
  if (type !== "CallExpression") {
    return false;
  }
  var name = o.get(node, "callee.name");
  if (name === defaultName) {
    return true;
  }
  var calleeType = o.get(node, "callee.type");
  if (calleeType === "MemberExpression") {
    if (o.get(node, "callee.object.name") === "Ember" && o.get(node, "callee.property.name") === defaultName) {
      return true;
    }
    if (o.get(node, "callee.object.type") === "FunctionExpression" && o.get(node, "callee.property.name") === extendedName) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getDependentKeys: getDependentKeys,
  isObserver: isObserver,
  isComputedProperty: isComputedProperty,
  isEmberField: isEmberField,
  expandDependentKeys: expandDependentKeys
};