// provides a facility to store words in a dictionary
var fs = require('fs');

var write = function(str) {
	process.stdout.write(str);
}

var writeln = function(str) {
	process.stdout.write(str+'\n');
}

var Dictionary = (function() {

	var loadFile = function(path, callback) {
		writeln('Reading '+path);
		var readStream = fs.createReadStream(path);
		var words = [];
		var prefix = '';

		readStream.on('data', function(data) {
			var lines = data.toString().split('\n');

			// dumdedum
			lines[0] = prefix + lines[0];
			prefix = lines[lines.length-1];
			lines = lines.slice(0, lines.length-1);
			words = words.concat(lines);

		});

		readStream.on('end', function() {
			writeln('finished reading '+path+' for a total of '+words.length+' words');
			callback(null, words);
		});

	};

	var loadFolder = function(folder, callback) {
		var words = [];

		writeln('Reading folder '+folder);
		fs.readdir(folder, function(err, files) {
			if (err) {
				throw { name: "FolderReadError", message: err.message };
			} else {
				var filecount = files.length + 1;

				var dec = function() {
					filecount-=1;
					if (filecount === 0) {
						writeln('Finished reading folder '+folder);
						callback(null, words);
					}
				};

				files.forEach(function(file) {
					loadFile(folder+'/'+file, function(err, filewords) {
						words = words.concat(filewords);
						dec();
					});
				});

				dec();
			};

		});

	};

	var makeDictionary = function(folderPath, callback) {

		var wordList = [];

		var wordExists = function(word) {
			return (wordList.indexOf(word) !== -1);
		};

		var nearbyWords = function(word) {
			var nearby = [];
			var len = word.length;
			wordList.forEach(function(elem) {
				if (elem.length === len) {
					// count the number of same letters
					var j, sameLetters=0;
					for(j=0;j<len;j++) {
						if (elem[j] === word[j]) sameLetters+= 1;
					};

					if (sameLetters === len - 1) {
						nearby.push(elem);
					}
				}
			});

			return nearby;
		};

		loadFolder(folderPath, function(err, words) {
			wordList = words;
			var dictionary = {
				findWord: wordExists,
				nearbyWords: nearbyWords
			};

			callback(null,dictionary);
		});
	}

	return {
		makeDictionary: makeDictionary
	}
	
}());

module.exports = Dictionary;