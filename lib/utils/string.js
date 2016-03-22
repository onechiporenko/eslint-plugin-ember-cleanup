/**
 * Levenshtein distance from https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function getLevenshteinDistance(a, b) {
  if (!a.length) {
    return b.length;
  }
  if (!b.length) {
    return a.length;
  }

  var matrix = [];

  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      }
      else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Damerau–Levenshtein distance
 * https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function getDamerauLevenshteinDistance(a, b) {
  if (!a) {
    if (!b) {
      return 0;
    }
    return b.length;
  }
  if (!b) {
    return a.length;
  }

  var aLength = a.length;
  var bLength = b.length;
  var matrix = [];

  var INF = aLength + bLength;
  matrix[0] = [INF];
  for (var i = 0; i <= aLength; i++) {
    matrix[i + 1] = [INF, i];
  }
  for (i = 0; i <= bLength; i++) {
    matrix[1][i + 1] = i;
    matrix[0][i + 1] = INF;
  }

  var sd = {};
  var ab = a + b;
  var abLength = ab.length;
  for (i = 0; i < abLength; i++) {
    var letter = ab[i];
    if (!sd.hasOwnProperty(letter)) {
      sd[letter] = 0;
    }
  }

  for (i = 1; i <= aLength; i++) {
    var DB = 0;
    for (var j = 1; j <= bLength; j++) {
      var i1 = sd[b[j - 1]];
      var j1 = DB;

      if (a[i - 1] === b[j - 1]) {
        matrix[i + 1][j + 1] = matrix[i][j];
        DB = j;
      }
      else {
        matrix[i + 1][j + 1] = Math.min(matrix[i][j], Math.min(matrix[i + 1][j], matrix[i][j + 1])) + 1;
      }
      matrix[i + 1][j + 1] = Math.min(matrix[i + 1][j + 1], matrix[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
    }
    sd[a[i - 1]] = i;
  }
  return matrix[aLength + 1][bLength + 1];
}

module.exports = {

  getLevenshteinDistance: getLevenshteinDistance,
  getDamerauLevenshteinDistance: getDamerauLevenshteinDistance

};