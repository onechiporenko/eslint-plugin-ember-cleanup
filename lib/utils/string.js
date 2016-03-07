/**
 * Levenshtein distance from https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function getLevenshteinDistance (a, b) {
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

module.exports = {

  getLevenshteinDistance: getLevenshteinDistance

};