var levenshteinDistance = require('./levenshtein');

var levenshteinCache = {};

function Node (word, tolerance) {
	this.branches = [];
	this.addWord(word);
	this.setTolerance(tolerance);
}

Node.prototype.addWord = function (word) {
	var isWord = typeof word === 'string' && word !== '';
	if (!isWord || this.root === word) {
		return;
	}
	if (!this.root) {
		this.root = word;
		return;
	}
	var wordDistance = this.calculateWordDistance(word);
	if (!(wordDistance in this.branches)) {
		this.branches[wordDistance] = new Node();
	}
	this.branches[wordDistance].addWord(word);
}

Node.prototype.findWord = function (word, tolerance) {
	var searchTolerance = isNonNegativeNumber(tolerance) ? tolerance : this.tolerance;
	if (typeof word !== 'string' || word === '') {
		return null;
	}
	var matches = [];
	var wordDistance = this.calculateWordDistance(word);
	if (wordDistance <= searchTolerance) {
		matches.push(this.root);
	}
	var maxDistanceForBranch = wordDistance + searchTolerance;
	var minDistanceForBranch = wordDistance - searchTolerance >= 0 ? wordDistance - searchTolerance : 0;
	var branchesToSearch = this.branches.slice(minDistanceForBranch, maxDistanceForBranch + 1);
	branchesToSearch.forEach(function (element) {
		if (element !== undefined) {
			var matchesFromBranch = element.findWord(word, tolerance);
			matches = matches.concat(matchesFromBranch);
		}
	})
	return matches;
}

Node.prototype.calculateWordDistance = function (word) {
	var wordDistance;
	var combinedWords;
	if (this.root > word) {
		combinedWords = this.root + ':' + word
	} else {
		combinedWords = word + ':' + this.root
	}
	if (levenshteinCache[combinedWords]) {
		wordDistance = levenshteinCache[combinedWords];
	} else {
		wordDistance = levenshteinDistance(this.root, word);
		levenshteinCache[combinedWords] = wordDistance;
	}
	return wordDistance;
	// return levenshteinDistance(this.root, word);
}

Node.prototype.setTolerance = function (tolerance) {
	if (isNonNegativeNumber(tolerance)) {
		this.tolerance = tolerance;
	}
}

function isNonNegativeNumber (number) {
	return typeof number === 'number' && number >= 0;
}

module.exports = Node;