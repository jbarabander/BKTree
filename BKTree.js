var levenshteinDistance = require('./levenshtein');

function Node (word, tolerance) {
	this.branches = [];
	this.addWord(word);
	if (typeof tolerance === 'number') {
		this.tolerance = tolerance;
	}
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
	var wordDistance = levenshteinDistance(this.root, word);
	if (!(wordDistance in this.branches)) {
		this.branches[wordDistance] = new Node();
	}
	this.branches[wordDistance].addWord(word);
}

Node.prototype.findWord = function (word, tolerance) {
	var searchTolerance = typeof tolerance === 'number' ? tolerance : this.tolerance;
	if (typeof word !== 'string' || word === '') {
		return null;
	}
	var matches = [];
	var wordDistance = levenshteinDistance(word, this.root);
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

module.exports = Node;