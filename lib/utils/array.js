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

/**
 * K-combinations
 * Get k-sized combinations of elements in a set
 * From https://gist.github.com/axelpale/3118596
 *
 * Example
 * <pre>
 *   var combos = getCombinations([1, 2, 3], 2);
 *   console.log(combos); // [[1,2], [1,3], [2, 3]]
 * </pre>
 *
 * @param {string[]} list Array of objects of any type. They are treated as unique
 * @param {number} k size of combinations to search for
 * @returns {string[][]} Array of found combinations, size of a combination is k
 */
function getCombinations(list, k) {
  var i, j, combos, head, tailCombos;

  if (k > list.length || k <= 0) {
    return [];
  }

  if (k === list.length) {
    return [list];
  }

  if (k === 1) {
    combos = [];
    for (i = 0; i < list.length; i++) {
      combos.push([list[i]]);
    }
    return combos;
  }

  combos = [];
  for (i = 0; i < list.length - k + 1; i++) {
    head = list.slice(i, i + 1);
    tailCombos = getCombinations(list.slice(i + 1), k - 1);
    for (j = 0; j < tailCombos.length; j++) {
      combos.push(head.concat(tailCombos[j]));
    }
  }
  return combos;
}

module.exports = {
  combine: combine,
  getCombinations: getCombinations
};