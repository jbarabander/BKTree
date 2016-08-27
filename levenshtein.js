function WagnerFischer (string1, string2) {
	var str1Length = string1.length
	var str2Length = string2.length
	var distanceMatrix = new Array(str1Length + 1)
	for (var i = 0; i <= str1Length; i++) {
		distanceMatrix[i] = new Array(str2Length + 1)
		distanceMatrix[i][0] = i
	}
	for (var j = 0; j <= str2Length; j++) {
		distanceMatrix[0][j] = j
	}

	for (var k = 0; k < str1Length; k++) {
		for (var l = 0; l < str2Length; l++) {
			if (string1[k] === string2[l]) {
				distanceMatrix[k + 1][l + 1] = distanceMatrix[k][l]
			} else {
				var deletion = distanceMatrix[k][l + 1] + 1
				var insertion = distanceMatrix[k + 1][l] + 1
				var substitution = distanceMatrix[k][l] + 1
				distanceMatrix[k + 1][l + 1] = Math.min(deletion, insertion, substitution)
			}
		}
	}
	return distanceMatrix[str1Length][str2Length]
}

module.exports = WagnerFischer
