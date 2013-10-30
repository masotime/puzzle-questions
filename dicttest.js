var dict = require('./lib/worddict2');

// simple heuristic
var distance = function(source, target) {
	var result = 0, i;

	if (source.length !== target.length) {
		return 9999999;
	}

	for (i=0; i<source.length; i++) {
		(source[i] === target[i]) || (result+=1);
	}

	return result;
}

var solve = function(source, target, dictionary) {
	var paths = [[source]]; // paths being considered
	var solutions = []; // solution paths
	var shortestDistance;
	var longestDistance = 0;
	var used = []; // words that have already been used
	var nearbyWordsInvocations = 0;

	// breadth-wise recursion, uses iteration
	while (paths.length > 0) {
		var currentPath = paths.shift();

		// console.log('considering '+currentPath+' - shortestDistance = '+shortestDistance);
		if (currentPath.length >= shortestDistance) {
			// console.log('skipping this path');
			continue;
		}

		if (currentPath.length > longestDistance) {
			longestDistance = currentPath.length;
			// console.log('path length is now '+longestDistance);
		}

		if (paths.length % 1000 === 0 && paths.length > 0) {
			console.log('# of paths is now '+paths.length);
		}

		var lastWord = currentPath[currentPath.length-1];
		var currentDistance = distance(lastWord, target);
		var nearbyWords = dictionary.nearbyWords(lastWord);
		nearbyWordsInvocations+=1;

		// we have a new candidate path if a nearby word is
		// 1. not already in the used words list
		// 2. has a smaller distance to the target word
		nearbyWords.forEach(function(word) {
			var wordUsedElsewhere = used.indexOf(word) !== -1;
			var wordNotCloser = distance(word, target) >= currentDistance;
			var wordAlreadyInPath = currentPath.indexOf(word) !== -1;

			if (wordAlreadyInPath || wordUsedElsewhere) {
				return;
			}

			// valid path found
			var newPath = currentPath.concat(word);

			if (word === target) {
				// terminal case, we do not add to the candidate paths
				solutions.push(newPath);
				shortestDistance = newPath.length;
			} else {
				paths.push(currentPath.concat(word));
				used.push(word);
			}

		});

	}

	// console.log('nearbyWordsInvocations = '+nearbyWordsInvocations);

	return solutions;
}

var Solver = function(dictionary) {
	return {
		solve: function(source, target) {
			console.log('solving '+source+' -> '+target);
			var startTime = new Date().getTime();
			var solutions = solve(source, target, dictionary);
			var endTime = new Date().getTime();
			solutions.forEach(function(soln, idx) {
				var log = "";
				soln.forEach(function(word, idx) {
					log += word;
					if (idx !== soln.length-1) {
						log += ' => ';
					}
				});

				console.log(log);
			});
			console.log('solved in '+ (endTime - startTime)+ 'ms');
			console.log('');
		}
	}
};

dict.makeDictionary('data/dict', function(err, dictionary) {
	/*console.log('Dictionary loaded');
	console.log('pineapple exists? '+dictionary.findWord('pineapple'));
	var nearby = dictionary.nearbyWords('pine');
	console.log('words close to pine: '+nearby);

	console.log('distance of aacc and adcd: ' + distance('aacc', 'adcd'));*/

	// let's see
	var solver = Solver(dictionary);
	var pairs = [
		['cat', 'dog'],
		['the', 'end'],
		['ruby', 'code'],
		['lead', 'gold'],
		['head', 'tail'],
		['black', 'white'],
		['amen', 'quay'],
		['ape', 'man'],
		['flour', 'bread'],
		['sleep', 'dream'],
		['one', 'two'],
		['grass', 'green'],
		['blue', 'pink'],
		['river', 'shore'],
		['witch', 'fairy'],
		['hate', 'veil'],
		['lass', 'male'],
		['word', 'gene'],
		['cold', 'warm'] // doesn't find the solution cold => cord => card => ward => warm
	];

	pairs.forEach(function(pair) {
		solver.solve(pair[0], pair[1]);
	});

});
