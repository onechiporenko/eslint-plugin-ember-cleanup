/**
 * <pre>
 *   var namespaces = ['a'];
 *   var names = ['c', 'd'];
 *   var combinations = combine(namespaces, names);
 *   console.log(combinations); // ['a.c', 'a.d', 'c', 'd']
 * </pre>
 *
 * @param {string[]} namespaces
 * @param {string[]} names
 * @returns {string[]}
 */
function combine(namespaces, names) {
  var ret = [];
  var _namespaces = Array.isArray(namespaces) ? namespaces : [];
  var _names = Array.isArray(names) ? names : [];
  _namespaces.forEach(function (ns) {
    _names.forEach(function (n) {
      ret.push(ns + "." + n);
    });
  });
  ret = ret.concat(_names);
  return ret;
}

module.exports = {
  combine: combine
};